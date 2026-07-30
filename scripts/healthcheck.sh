# Health Check and Auto-Recovery Script
# Run this script periodically (e.g., via cron or Kubernetes liveness probes)

set -e

APP_URL="${HEALTHCHECK_URL:-http://localhost:3000/health}"
MAX_RETRIES=3
RETRY_DELAY=5

check_health() {
    local status
    status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$APP_URL" 2>/dev/null || echo "000")
    echo "$status"
}

restart_service() {
    echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) - Service unhealthy, attempting restart..." >> logs/recovery.log
    pm2 restart hightech-api 2>/dev/null || true
    systemctl restart hightech-api 2>/dev/null || true
    docker restart hightech-app 2>/dev/null || true
}

retry_count=0
while [ $retry_count -lt $MAX_RETRIES ]; do
    http_code=$(check_health)

    if [ "$http_code" = "200" ]; then
        echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) - Health check OK (HTTP $http_code)" >> logs/healthcheck.log
        exit 0
    fi

    retry_count=$((retry_count + 1))
    echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) - Health check failed (HTTP $http_code), attempt $retry_count/$MAX_RETRIES" >> logs/healthcheck.log

    if [ $retry_count -ge $MAX_RETRIES ]; then
        echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) - All retries exhausted, restarting service" >> logs/recovery.log
        restart_service
        sleep 10
        http_code=$(check_health)
        if [ "$http_code" = "200" ]; then
            echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) - Recovery successful after restart" >> logs/recovery.log
            exit 0
        else
            echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) - Recovery failed, manual intervention may be required" >> logs/recovery.log
            # Alert administrators
            curl -s -X POST "${SLACK_WEBHOOK_URL:-}" \
                -H "Content-Type: application/json" \
                -d "{\"text\":\"High-Tech College API recovery failed after restart. Manual intervention required.\"}" 2>/dev/null || true
            exit 1
        fi
    fi

    sleep $RETRY_DELAY
done