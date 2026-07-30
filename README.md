# High-Tech College Website

Production-ready college website featuring glassmorphism floating navigation, full-screen hero section, admissions badge, statistics, and smooth scrolling sections.

## Architecture

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS (SPA)
- **Backend API**: Express.js with Redis caching, rate limiting, queue system
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis (session, API response, image cache)
- **Queue**: BullMQ for background jobs (emails, image processing, reports)
- **Reverse Proxy**: Nginx with Brotli/Gzip compression, security headers
- **Containerization**: Docker + Docker Compose + Kubernetes
- **Monitoring**: Prometheus + Grafana + Winston logging
- **CDN**: Static assets served via Nginx with aggressive caching

## Quick Start

### Development

```bash
npm install
npm run dev
```

### Production with Docker

```bash
# Copy environment file
cp .env.example .env
# Edit .env with your secrets

# Start all services
docker-compose up -d

# Health check
curl http://localhost/health

# View logs
docker-compose logs -f app
```

### Production with Kubernetes

```bash
# Apply all K8s manifests
kubectl apply -f infra/k8s/

# Check deployment status
kubectl get pods -n production
kubectl get svc -n production
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `DATABASE_DIRECT_URL` | Direct PostgreSQL connection for migrations | Yes |
| `REDIS_URL` | Redis connection URL | Yes |
| `JWT_SECRET` | JWT signing secret (min 256 bits) | Yes |
| `ADMIN_PIN` | CMS admin PIN | Yes |
| `CORS_ORIGIN` | Allowed CORS origin | No |
| `LOG_LEVEL` | Log level (debug/info/warn/error) | No |
| `PORT` | Server port (default: 3000) | No |
| `CONTACT_EMAIL` | Admin contact email | No |

## Infrastructure

### Services
- **API Server** (Express + TypeScript) - Main application on port 3000
- **PostgreSQL** - Database with connection pooling, prepared statements
- **Redis** - Caching layer (session, API cache, image cache, queue broker)
- **Nginx** - Reverse proxy with security headers, compression, rate limiting, CDN caching
- **BullMQ Workers** - Background job processing (emails, image optimization, reports)

### API Endpoints
- `GET /health` - Health check
- `GET /health/deep` - Deep health check (DB, Redis)
- `GET /metrics` - Prometheus metrics
- `GET /api/courses` - List courses (cached)
- `GET /api/courses/:id` - Course details
- `GET /api/applications` - List applications (paginated, cached)
- `POST /api/applications` - Submit application
- `GET /api/campus-life` - Campus life highlights
- `POST /api/contact/messages` - Submit contact message
- `POST /api/auth/login` - Authenticate
- `GET /api/stats/dashboard` - Dashboard stats (cached)
- `POST /api/upload` - File upload (queued for processing)

### Background Queues
- **email** - Confirmation emails, contact messages
- **image-processing** - Image optimization (WebP/AVIF conversion, resize)
- **report-generation** - PDF reports, analytics
- **notifications** - Status update notifications

## Performance Targets

- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **TTFB**: < 200ms (cached)
- **Bundle size**: < 200KB gzipped

## Security

- Helmet security headers (HSTS, CSP, X-Frame-Options, etc.)
- Rate limiting (100 req/15min general, 5 req/15min login)
- Input sanitization and validation
- SQL injection prevention (Prisma parameterized queries)
- XSS protection (Content-Security-Policy, output encoding)
- CSRF protection (same-site cookies, token verification)
- JWT authentication with secure cookies
- HTTPS enforcement (HSTS preload)
- Request ID tracking across services

## Monitoring & Observability

- **Metrics**: Prometheus (request duration, error rate, memory, CPU, Redis, DB)
- **Dashboards**: Grafana (request rate, latency, error rate, DB queries, cache hit rate)
- **Logging**: Winston (structured JSON logs, error/combined files)
- **Health Checks**: `/health` (liveness), `/health/deep` (readiness)
- **Alerting**: Slack webhook on recovery failure

## Testing

```bash
# Load test
node scripts/load-test.js

# With custom parameters
TARGET_URL=https://hightech-college.ke DURATION=120 CONCURRENCY=500 node scripts/load-test.js

# Health check
bash scripts/healthcheck.sh
```

## Deployment

### Docker
```bash
docker-compose up -d --build
```

### Kubernetes
```bash
kubectl apply -f infra/k8s/deploy.yml
```

### CI/CD (GitHub Actions)
- Test → Build → Push Docker image → Deploy to staging → Deploy to production
- Zero-downtime rolling updates with PodDisruptionBudget
- HPA scales 2-10 replicas based on CPU/memory/req rate

## Backup & Recovery

- PostgreSQL: Automated WAL archiving with `pg_dump` scheduled backup
- Redis: AOF persistence with `everysec` sync
- Database replication support via PostgreSQL streaming replication
- Disaster recovery: Point-in-time recovery from WAL archiving