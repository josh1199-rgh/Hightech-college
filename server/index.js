import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import morgan from 'morgan';
import winston from 'winston';
import expressWinston from 'express-winston';
import { createClient } from 'redis';
import { PrismaClient } from '@prisma/client';
import { Queue, Worker } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'hightech-college-api' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.set('trust proxy', 1);

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  credentials: true,
  maxAge: 86400,
}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:', '*.googleapis.com', '*.gstatic.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      connectSrc: ["'self'", 'wss:', 'https:'],
      frameSrc: ["'self'", 'https://maps.google.com'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'same-origin' },
  originAgentCluster: true,
  xContentTypeOptions: true,
  xDnsPrefetchControl: { allow: false },
  xDownloadOptions: true,
  xFrameOptions: 'DENY',
  xPermmittedCrossDomainPolicies: 'none',
}));

app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
}));

app.use(express.json({ limit: '10mb', strict: true }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

app.use(expressWinston.requestWhitelist([
  'body', 'params', 'query', 'headers', 'method', 'url', 'ip', 'user-agent',
]));
app.use(expressWinston.responseWhitelist(['statusCode', 'body']));
app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}} - {{res.statusCode}} - {{res.responseTime}}ms',
  expressFormat: false,
  colorize: false,
  ignoreRoute: (req, res) => false,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
  skipSuccessfulRequests: false,
  keyGenerator: (req) => req.ip,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'API rate limit exceeded. Please retry later.' },
});

const slowDownLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: (hits) => hits * 100,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
});

app.use('/api/', apiLimiter);
app.use('/api/', slowDownLimiter);
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/verify', loginLimiter);

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379',
  password: process.env.REDIS_PASSWORD || undefined,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 100, 5000),
    tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
  },
});

redisClient.on('error', (err) => logger.error('Redis connection error', { error: err.message }));
redisClient.on('connect', () => logger.info('Redis connected'));
redisClient.on('ready', () => logger.info('Redis ready'));

const prisma = new PrismaClient({
  log: NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  errorFormat: 'pretty',
});

prisma.$on('error', (e) => logger.error('Prisma error', { error: e.message }));

const connectionOpts = {
  connection: { host: 'redis', port: 6379, password: process.env.REDIS_PASSWORD },
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
};

const emailQueue = new Queue('email', { connection: redisClient });
const imageQueue = new Queue('image-processing', { connection: redisClient });
const reportQueue = new Queue('report-generation', { connection: redisClient });
const notificationQueue = new Queue('notifications', { connection: redisClient });

const workerOptions = {
  connection: redisClient,
  concurrency: 2,
};

const emailWorker = new Worker('email', async (job) => {
  logger.info('Processing email job', { jobId: job.id });
  try {
    await sendEmail(job.data);
    logger.info('Email job completed', { jobId: job.id });
  } catch (error) {
    logger.error('Email job failed', { jobId: job.id, error: error.message });
    throw error;
  }
}, workerOptions);

const imageWorker = new Worker('image-processing', async (job) => {
  logger.info('Processing image job', { jobId: job.id });
  try {
    await processImage(job.data);
    logger.info('Image job completed', { jobId: job.id });
  } catch (error) {
    logger.error('Image job failed', { jobId: job.id, error: error.message });
    throw error;
  }
}, workerOptions);

app.use((req, res, next) => {
  req.id = uuidv4();
  req.startTime = Date.now();
  res.setHeader('X-Request-ID', req.id);
  next();
});

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: NODE_ENV,
  });
});

app.get('/health/deep', async (_req, res) => {
  const checks = {};
  const overallStatus = [];

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = { status: 'healthy', responseTime: Date.now() };
    overallStatus.push('healthy');
  } catch (e) {
    checks.database = { status: 'unhealthy', error: e.message };
    overallStatus.push('unhealthy');
  }

  try {
    await redisClient.ping();
    checks.redis = { status: 'healthy', responseTime: Date.now() };
    overallStatus.push('healthy');
  } catch (e) {
    checks.redis = { status: 'unhealthy', error: e.message };
    overallStatus.push('unhealthy');
  }

  checks.memory = {
    status: 'healthy',
    rss: process.memoryUsage.rss(),
    heapTotal: process.memoryUsage.heapTotal(),
    heapUsed: process.memoryUsage.heapUsed(),
    external: process.memoryUsage.external(),
  };
  checks.cpu = { loadAvg: process.loadavg(), platform: process.platform };

  const isHealthy = !overallStatus.includes('unhealthy');
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'degraded',
    checks,
    uptime: process.uptime(),
  });
});

app.get('/metrics', async (_req, res) => {
  try {
    const collectDefaultMetrics = await import('prom-client');
    res.setHeader('Content-Type', collectDefaultMetrics.register.contentType);
    res.end(await collectDefaultMetrics.register.metrics());
  } catch (e) {
    res.status(500).json({ error: 'Metrics not available' });
  }
});

app.use('/api/auth', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token && req.path !== '/login' && req.path !== '/verify' && req.method !== 'POST') {
    return res.status(401).json({ error: 'Authentication required' });
  }
  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      if (req.path !== '/login' && req.path !== '/verify') {
        return res.status(401).json({ error: 'Invalid token' });
      }
    }
  }
  next();
});

app.get('/api/courses', async (req, res) => {
  try {
    const cacheKey = `courses:${JSON.stringify(req.query)}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.setHeader('X-Cache', 'HIT').json(JSON.parse(cached));
    }
    const courses = await prisma.course.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: { updatedAt: 'desc' },
    });
    await redisClient.setEx(cacheKey, 300, JSON.stringify(courses));
    res.setHeader('X-Cache', 'MISS');
    res.json(courses);
  } catch (error) {
    logger.error('GET /api/courses failed', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/courses/:id', async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: { category: true, applications: { take: 10 } },
    });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (error) {
    logger.error('GET /api/courses/:id failed', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const course = await prisma.course.create({ data: req.body });
    await redisClient.del('courses:*');
    res.status(201).json(course);
  } catch (error) {
    logger.error('POST /api/courses failed', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/applications', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const cacheKey = `applications:${page}:${limit}:${JSON.stringify(req.query)}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.setHeader('X-Cache', 'HIT').json(JSON.parse(cached));
    }
    const [applications, total] = await Promise.all([
      prisma.studentApplication.findMany({
        where: req.query.status ? { status: req.query.status } : {},
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { course: { select: { id: true, title: true } } },
      }),
      prisma.studentApplication.count({
        where: req.query.status ? { status: req.query.status } : {},
      }),
    ]);
    const result = { data: applications, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
    await redisClient.setEx(cacheKey, 60, JSON.stringify(result));
    res.setHeader('X-Cache', 'MISS');
    res.json(result);
  } catch (error) {
    logger.error('GET /api/applications failed', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/applications', async (req, res) => {
  try {
    const application = await prisma.studentApplication.create({ data: req.body });
    await emailQueue.add('send-confirmation', {
      to: req.body.email,
      type: 'application_confirmation',
      data: { applicantName: req.body.applicantName, program: req.body.program },
    });
    res.status(201).json(application);
  } catch (error) {
    logger.error('POST /api/applications failed', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/api/applications/:id/status', async (req, res) => {
  try {
    const application = await prisma.studentApplication.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
    });
    await notificationQueue.add('status-update', {
      applicationId: req.params.id,
      status: req.body.status,
      email: application.email,
    });
    res.json(application);
  } catch (error) {
    logger.error('PATCH /api/applications/:id/status failed', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/campus-life', async (req, res) => {
  try {
    const items = await prisma.campusLife.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(items);
  } catch (error) {
    logger.error('GET /api/campus-life failed', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/contact/messages', async (req, res) => {
  try {
    const message = await prisma.contactMessage.create({ data: req.body });
    await emailQueue.add('contact-email', {
      to: process.env.CONTACT_EMAIL || 'admin@hightech.ac.ke',
      type: 'contact_message',
      data: req.body,
    });
    res.status(201).json(message);
  } catch (error) {
    logger.error('POST /api/contact/messages failed', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    logger.error('POST /api/auth/login failed', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/stats/dashboard', async (_req, res) => {
  try {
    const cacheKey = 'dashboard:stats';
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.setHeader('X-Cache', 'HIT').json(JSON.parse(cached));
    const [totalStudents, activeApplications, totalCourses, newMessages] = await Promise.all([
      prisma.studentApplication.count(),
      prisma.studentApplication.count({ where: { status: 'Pending' } }),
      prisma.course.count({ where: { active: true } }),
      prisma.contactMessage.count({ where: { status: 'Unread' } }),
    ]);
    const stats = { totalStudents, activeApplications, totalCourses, newMessages };
    await redisClient.setEx(cacheKey, 60, JSON.stringify(stats));
    res.setHeader('X-Cache', 'MISS');
    res.json(stats);
  } catch (error) {
    logger.error('GET /api/stats/dashboard failed', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/upload', async (req, res) => {
  try {
    const files = req.files || [];
    const results = [];
    for (const file of files) {
      const job = await imageQueue.add('optimize-image', {
        filename: file.filename,
        originalPath: file.path,
        sizes: [128, 256, 512, 1024],
        formats: ['webp', 'avif'],
      });
      results.push({ filename: file.filename, jobId: job.id });
    }
    res.status(202).json({ message: 'Images queued for processing', results });
  } catch (error) {
    logger.error('POST /api/upload failed', { error: error.message });
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, _req, res, _next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(err.status || 500).json({ error: 'Internal server error' });
});

async function sendEmail(data) {
  logger.info('Sending email', { to: data.to, type: data.type });
}

async function processImage(data) {
  logger.info('Processing image', { filename: data.filename });
}

async function startServer() {
  try {
    await redisClient.connect();
    logger.info('Redis connected');
    await prisma.$connect();
    logger.info('Database connected');

    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`Server running on port ${PORT} in ${NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
}

const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}, starting graceful shutdown`);
  const server = app.listen(PORT);
  server.close();
  await Promise.allSettled([
    redisClient.quit(),
    prisma.$disconnect(),
  ]);
  logger.info('Graceful shutdown complete');
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', { error: err.message, stack: err.stack });
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', { reason: reason.message || String(reason) });
});

startServer();