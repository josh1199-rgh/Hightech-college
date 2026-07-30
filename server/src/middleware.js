const { ExpressRateLimit } = require('express-rate-limit');
const slowDown = require('express-slow-down');
const { body, validationResult } = require('express-validator');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');

const logger = {
  error: (msg, meta = {}) => {
    const entry = JSON.stringify({ level: 'error', message: msg, ...meta, timestamp: new Date().toISOString() });
    console.error(entry);
    try { fs.appendFileSync(path.join(__dirname, '..', 'logs', 'error.log'), entry + '\n'); } catch (e) {}
  },
  warn: (msg, meta = {}) => {
    const entry = JSON.stringify({ level: 'warn', message: msg, ...meta, timestamp: new Date().toISOString() });
    console.warn(entry);
  },
  info: (msg, meta = {}) => {
    const entry = JSON.stringify({ level: 'info', message: msg, ...meta, timestamp: new Date().toISOString() });
    console.log(entry);
  },
};

const rateLimitMiddleware = ExpressRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  skipSuccessfulRequests: false,
});

const apiRateLimit = ExpressRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

const loginRateLimit = ExpressRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

const slowDownMiddleware = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: (hits) => hits * 100,
});

const validateRequest = (schema) => {
  return [
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
};

const sanitizeInput = (obj) => {
  if (typeof obj === 'string') return obj.replace(/[<>"'&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;' })[c] || c);
  if (Array.isArray(obj)) return obj.map(sanitizeInput);
  if (obj && typeof obj === 'object') return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, sanitizeInput(v)]));
  return obj;
};

const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      connectSrc: ["'self'"],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  crossOriginEmbedderPolicy: true,
});

module.exports = {
  rateLimitMiddleware,
  apiRateLimit,
  loginRateLimit,
  slowDownMiddleware,
  validateRequest,
  sanitizeInput,
  securityHeaders,
  logger,
};