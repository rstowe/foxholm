#!/usr/bin/env node

const http = require('http');

const options = {
  hostname: process.env.HEALTH_CHECK_HOST || 'localhost',
  port: process.env.PORT || 3001,
  path: '/api/health',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Health check passed');
      console.log('Response:', data);
      process.exit(0);
    } else {
      console.error('❌ Health check failed');
      console.error(`Status code: ${res.statusCode}`);
      console.error('Response:', data);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Health check failed');
  console.error('Error:', error.message);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('❌ Health check timed out');
  req.destroy();
  process.exit(1);
});

req.end();