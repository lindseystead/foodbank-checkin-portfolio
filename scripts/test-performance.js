#!/usr/bin/env node
/**
 * Performance Testing Script
 * 
 * Tests API response times and gathers performance metrics
 * Run with: node scripts/test-performance.js
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'https://your-backend.railway.app/api';
const TEST_ITERATIONS = 10;

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
};

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const startTime = Date.now();
    
    const req = client.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        resolve({
          statusCode: res.statusCode,
          responseTime,
          data: data ? JSON.parse(data) : null,
          success: res.statusCode >= 200 && res.statusCode < 300
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

async function testEndpoint(name, endpoint, method = 'GET', body = null, headers = {}) {
  console.log(`\n${colors.cyan}Testing: ${name}${colors.reset}`);
  console.log(`${colors.blue}Endpoint: ${endpoint}${colors.reset}`);
  
  const responseTimes = [];
  const errors = [];
  
  for (let i = 0; i < TEST_ITERATIONS; i++) {
    try {
      const result = await makeRequest(`${API_BASE_URL}${endpoint}`, {
        method,
        body,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      });
      
      if (result.success) {
        responseTimes.push(result.responseTime);
        process.stdout.write(`${colors.green}.${colors.reset}`);
      } else {
        errors.push({ status: result.statusCode, time: result.responseTime });
        process.stdout.write(`${colors.yellow}X${colors.reset}`);
      }
    } catch (error) {
      errors.push({ error: error.message });
      process.stdout.write(`${colors.red}E${colors.reset}`);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n');
  
  if (responseTimes.length === 0) {
    console.log(`${colors.red}No successful responses${colors.reset}`);
    if (errors.length > 0) {
      console.log(`Errors: ${JSON.stringify(errors, null, 2)}`);
    }
    return null;
  }
  
  const sorted = [...responseTimes].sort((a, b) => a - b);
  const avg = Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const median = sorted[Math.floor(sorted.length / 2)];
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const p99 = sorted[Math.floor(sorted.length * 0.99)];
  
  console.log(`${colors.green}✓ Results (${responseTimes.length}/${TEST_ITERATIONS} successful):${colors.reset}`);
  console.log(`  Average: ${colors.cyan}${avg}ms${colors.reset}`);
  console.log(`  Min: ${colors.green}${min}ms${colors.reset}`);
  console.log(`  Max: ${colors.yellow}${max}ms${colors.reset}`);
  console.log(`  Median: ${colors.cyan}${median}ms${colors.reset}`);
  console.log(`  P95: ${colors.yellow}${p95}ms${colors.reset}`);
  console.log(`  P99: ${colors.yellow}${p99}ms${colors.reset}`);
  
  return {
    name,
    endpoint,
    avg,
    min,
    max,
    median,
    p95,
    p99,
    successRate: (responseTimes.length / TEST_ITERATIONS * 100).toFixed(1)
  };
}

async function runPerformanceTests() {
  console.log(`${colors.blue}════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}  Performance Test Suite${colors.reset}`);
  console.log(`${colors.blue}════════════════════════════════════════${colors.reset}`);
  console.log(`\nAPI Base URL: ${API_BASE_URL}`);
  console.log(`Iterations per endpoint: ${TEST_ITERATIONS}\n`);
  
  const results = [];
  
  // Test health endpoint
  const healthResult = await testEndpoint('Health Check', '/health');
  if (healthResult) results.push(healthResult);
  
  // Test metrics endpoint
  const metricsResult = await testEndpoint('Performance Metrics', '/checkin/metrics');
  if (metricsResult) results.push(metricsResult);
  
  // Test stats endpoint
  const statsResult = await testEndpoint('Check-In Stats', '/checkin/stats');
  if (statsResult) results.push(statsResult);
  
  // Test analytics endpoint
  const analyticsResult = await testEndpoint('Analytics', '/checkin/analytics');
  if (analyticsResult) results.push(analyticsResult);
  
  // Test check-in endpoint (with sample data)
  const checkinResult = await testEndpoint(
    'Check-In (POST)',
    '/checkin',
    'POST',
    {
      phoneNumber: '2505551234',
      lastName: 'Test'
    }
  );
  if (checkinResult) results.push(checkinResult);
  
  // Summary
  console.log(`\n${colors.blue}════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}  Summary${colors.reset}`);
  console.log(`${colors.blue}════════════════════════════════════════${colors.reset}\n`);
  
  if (results.length > 0) {
    results.forEach(result => {
      const speedEmoji = result.avg < 100 ? '🚀' : result.avg < 300 ? '✅' : '⚠️';
      console.log(`${speedEmoji} ${result.name.padEnd(25)} | Avg: ${String(result.avg).padStart(4)}ms | P95: ${String(result.p95).padStart(4)}ms | Success: ${result.successRate}%`);
    });
    
    const overallAvg = Math.round(results.reduce((sum, r) => sum + r.avg, 0) / results.length);
    console.log(`\n${colors.cyan}Overall Average Response Time: ${overallAvg}ms${colors.reset}`);
    
    console.log(`\n${colors.green}✓ Performance test completed!${colors.reset}`);
    console.log(`\n${colors.yellow}Tip: Add these numbers to your GitHub description!${colors.reset}`);
  } else {
    console.log(`${colors.red}No successful tests. Check your API_BASE_URL.${colors.reset}`);
  }
}

// Run tests
runPerformanceTests().catch(console.error);

