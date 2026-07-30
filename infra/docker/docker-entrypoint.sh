#!/bin/sh
set -e

echo "Starting High-Tech College production server..."

npm run migrate 2>/dev/null || true

exec pm2-runtime start server/index.js --name "hightech-api" --no-daemon --max-memory-restart 512M