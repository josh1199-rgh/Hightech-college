const http = require('http');
const { performance } = require('perf_hooks');

const CONFIG = {
  target: process.env.TARGET_URL || 'http://localhost:3000',
  duration: parseInt(process.env.DURATION) || 60,
  concurrency: parseInt(process.env.CONCURRENCY) || 100,
  rampUp: parseInt(process.env.RAMP_UP) || 10,
  endpoint: process.env.ENDPOINT || '/',
  method: process.env.METHOD || 'GET',
  body: process.env.BODY ? JSON.stringify(JSON.parse(process.env.BODY)) : null,
  outputFile: process.env.OUTPUT || 'results/load-test-results.json',
};

const STATS_INTERVAL_MS = 5000;
let running = true;
let totalRequests = 0;
let successCount = 0;
let errorCount = 0;
let totalLatency = 0;
let minLatency = Infinity;
let maxLatency = 0;
let latencyBuckets = { '100ms': 0, '200ms': 0, '500ms': 0, '1s': 0, '2s': 0, '5s': 0, '10s': 0, '>10s': 0 };
let concurrentRequests = 0;
let maxConcurrent = 0;
let requestTimes = [];

const colorize = (level, msg) => {
  const colors = { red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', blue: '\x1b[34m', reset: '\x1b[0m' };
  return `${colors[level] || ''}${msg}${colors.reset}`;
};

const log = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

const runRequest = () => {
  return new Promise((resolve) => {
    const start = performance.now();
    concurrentRequests++;
    maxConcurrent = Math.max(maxConcurrent, concurrentRequests);

    const url = CONFIG.endpoint;
    const parsedUrl = new URL(url, CONFIG.target);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 80,
      path: parsedUrl.pathname + parsedUrl.search,
      method: CONFIG.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'LoadTest/1.0.0',
        'X-Request-ID': `loadtest-${Math.random().toString(36).substr(2, 9)}`,
      },
      timeout: 30000,
    };

    if (CONFIG.body) {
      options.headers['Content-Length'] = Buffer.byteLength(CONFIG.body);
    }

    const req = http.request(options, (res) => {
      const latency = performance.now() - start;
      concurrentRequests--;
      totalRequests++;
      totalLatency += latency;
      minLatency = Math.min(minLatency, latency);
      maxLatency = Math.max(maxLatency, latency);
      requestTimes.push(latency);

      const bucket = latency < 100 ? '100ms' : latency < 200 ? '200ms' : latency < 500 ? '500ms' : latency < 1000 ? '1s' : latency < 2000 ? '2s' : latency < 5000 ? '5s' : latency < 10000 ? '10s' : '>10s';
      latencyBuckets[bucket]++;

      if (res.statusCode >= 200 && res.statusCode < 400) {
        successCount++;
      } else if (res.statusCode >= 429) {
        errorCount++;
      } else if (res.statusCode >= 500) {
        errorCount++;
      } else {
        successCount++;
      }

      res.resume();
      res.on('end', resolve);
    });

    req.on('error', (err) => {
      concurrentRequests--;
      totalRequests++;
      const latency = performance.now() - start;
      errorCount++;
      requestTimes.push(latency);
      resolve();
    });

    req.on('timeout', () => {
      concurrentRequests--;
      totalRequests++;
      errorCount++;
      req.destroy();
      resolve();
    });

    if (CONFIG.body) {
      req.write(CONFIG.body);
    }
    req.end();
  });
};

const worker = async () => {
  while (running) {
    await runRequest();
    await new Promise(resolve => setTimeout(resolve, 10));
  }
};

const runRampUp = async () => {
  const promises = [];
  for (let i = 0; i < CONFIG.rampUp; i++) {
    promises.push(worker());
    await new Promise(resolve => setTimeout(resolve, 100));
  }
};

const printStats = () => {
  const duration = (performance.now() - statsStartTime) / 1000;
  const rps = totalRequests / duration;
  const avgLatency = totalRequests > 0 ? totalLatency / totalRequests : 0;
  const p50 = requestTimes.sort((a, b) => a - b)[Math.floor(requestTimes.length * 0.50)] || 0;
  const p95 = requestTimes.sort((a, b) => a - b)[Math.floor(requestTimes.length * 0.95)] || 0;
  const p99 = requestTimes.sort((a, b) => a - b)[Math.floor(requestTimes.length * 0.99)] || 0;
  const errorRate = totalRequests > 0 ? (errorCount / totalRequests) * 100 : 0;
  const avgResponseTime = totalRequests > 0 ? totalLatency / totalRequests : 0;
  const minResponseTime = minLatency === Infinity ? 0 : minLatency;
  const maxResponseTime = maxLatency;

  console.log(`\n${'='.repeat(60)}`);
  console.log(`${colorize('blue', `Load Test Results - ${CONFIG.target}${CONFIG.endpoint}`)}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Duration:           ${duration.toFixed(1)}s`);
  console.log(`Total Requests:     ${totalRequests}`);
  console.log(`Requests/sec:       ${rps.toFixed(2)}`);
  console.log(`Concurrency:        ${CONFIG.concurrency} (Peak: ${maxConcurrent})`);
  console.log(`--- Latency (ms) ---`);
  console.log(`Min:                ${minResponseTime.toFixed(2)}`);
  console.log(`Average:            ${avgResponseTime.toFixed(2)}`);
  console.log(`Max:                ${maxResponseTime.toFixed(2)}`);
  console.log(`P50:                ${p50.toFixed(2)}`);
  console.log(`P95:                ${p95.toFixed(2)}`);
  console.log(`P99:                ${p99.toFixed(2)}`);
  console.log(`--- Status ---`);
  console.log(`Success:            ${colorize('green', successCount.toString())} (${((successCount/totalRequests)*100).toFixed(1)}%)`);
  console.log(`Errors:             ${colorize('red', errorCount.toString())} (${errorRate.toFixed(1)}%)`);
  console.log(`--- Latency Distribution ---`);
  for (const [bucket, count] of Object.entries(latencyBuckets)) {
    const bar = '#'.repeat(Math.min(50, Math.round(count / Math.max(1, ...Object.values(latencyBuckets)) * 50)));
    console.log(`  ${bucket.padEnd(8)} ${colorize('green', bar)} ${count}`);
  }
  console.log(`${'='.repeat(60)}\n`);

  return { duration, totalRequests, rps, concurrency: maxConcurrent, latency: { min: minResponseTime, avg: avgResponseTime, max: maxResponseTime, p50, p95, p99 }, successCount, errorCount, errorRate, latencyBuckets };
};

let statsStartTime = Date.now();

const runTest = async () => {
  log(colorize('blue', `Starting load test: ${CONFIG.target}${CONFIG.endpoint}`));
  log(`Duration: ${CONFIG.duration}s, Concurrency: ${CONFIG.concurrency}, Ramp-up: ${CONFIG.rampUp}s`);
  log(`Method: ${CONFIG.method}, Body: ${CONFIG.body ? 'Yes' : 'No'}`);

  process.stdout.write('Progress: ');
  for (let i = 0; i < CONFIG.duration; i += STATS_INTERVAL_MS / 1000) {
    process.stdout.write('.');
    await new Promise(resolve => setTimeout(resolve, STATS_INTERVAL_MS));
  }
  process.stdout.write('\n');

  running = false;
  await new Promise(resolve => setTimeout(resolve, 1000));

  const results = printStats();

  try {
    require('fs').mkdirSync(require('path').dirname(CONFIG.outputFile), { recursive: true });
    require('fs').writeFileSync(CONFIG.outputFile, JSON.stringify(results, null, 2));
    log(`Results saved to ${CONFIG.outputFile}`);
  } catch(e) {
    log(`Could not save results: ${e.message}`);
  }

  if (results.errorRate > 5) {
    log(colorize('red', `HIGH ERROR RATE: ${results.errorRate.toFixed(1)}%`));
    process.exit(1);
  }

  process.exit(0);
};

runRampUp().then(() => runTest());