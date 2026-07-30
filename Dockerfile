FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY server/package*.json ./server/
RUN npm ci --omit=dev && npm install --prefix server

COPY src/ ./src/
COPY public/ ./public/ 2>/dev/null || true
COPY index.html ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY tailwind.config.ts ./ 2>/dev/null || true
COPY postcss.config.* ./ 2>/dev/null || true

RUN npm run build

FROM node:20-alpine AS runner

RUN apk add --no-cache \
    curl \
    python3 \
    make \
    g++ \
    bash \
    && rm -rf /var/cache/apk/*

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup -g 1001 -S nodejs && \
    adduser -S hightech -u 1001 && \
    mkdir -p /app/dist /app/logs /app/server && \
    chown -R hightech:nodejs /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server ./server
COPY server/package.json ./server/package.json
COPY package.json ./
COPY .env.example ./
COPY nginx.conf /etc/nginx/nginx.conf
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh && \
    chown -R hightech:nodejs /app && \
    npm install -g pm2

USER hightech
EXPOSE 3000
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["pm2-runtime", "start", "server/index.js", "--name", "hightech-api", "--no-daemon", "--watch", "--max-memory-restart", "512M", "--exp-backoff-restart-delay", "1000", "--listen-timeout", "60000", "--kill-timeout", "30000"]