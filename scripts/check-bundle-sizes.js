#!/usr/bin/env node
/**
 * Bundle Size Checker
 * 
 * Checks the built bundle sizes for client and admin apps
 * Run after: cd client && npm run build && cd ../admin && npm run build
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function getDirectorySize(dirPath) {
  let totalSize = 0;
  
  try {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        totalSize += getDirectorySize(filePath);
      } else {
        totalSize += stats.size;
      }
    });
  } catch (error) {
    // Directory doesn't exist
  }
  
  return totalSize;
}

function analyzeBuild(dirPath, name) {
  console.log(`\n${colors.cyan}Analyzing ${name}...${colors.reset}`);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`${colors.red}✗ Build directory not found: ${dirPath}${colors.reset}`);
    console.log(`${colors.yellow}  Run: cd ${path.dirname(dirPath)} && npm run build${colors.reset}`);
    return null;
  }
  
  const totalSize = getDirectorySize(dirPath);
  const formattedSize = formatBytes(totalSize);
  
  // Check for specific files
  const assetsPath = path.join(dirPath, 'assets');
  let jsSize = 0;
  let cssSize = 0;
  let otherSize = 0;
  
  if (fs.existsSync(assetsPath)) {
    const assets = fs.readdirSync(assetsPath);
    assets.forEach(asset => {
      const assetPath = path.join(assetsPath, asset);
      const stats = fs.statSync(assetPath);
      if (asset.endsWith('.js')) {
        jsSize += stats.size;
      } else if (asset.endsWith('.css')) {
        cssSize += stats.size;
      } else {
        otherSize += stats.size;
      }
    });
  }
  
  console.log(`${colors.green}✓ Total build size: ${colors.cyan}${formattedSize}${colors.reset}`);
  if (jsSize > 0) {
    console.log(`  JavaScript: ${formatBytes(jsSize)}`);
  }
  if (cssSize > 0) {
    console.log(`  CSS: ${formatBytes(cssSize)}`);
  }
  if (otherSize > 0) {
    console.log(`  Other assets: ${formatBytes(otherSize)}`);
  }
  
  return {
    name,
    totalSize,
    jsSize,
    cssSize,
    otherSize,
    formatted: formattedSize
  };
}

function checkBundleSizes() {
  console.log(`${colors.blue}════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}  Bundle Size Analysis${colors.reset}`);
  console.log(`${colors.blue}════════════════════════════════════════${colors.reset}`);
  
  const results = [];
  
  // Check client build
  const clientResult = analyzeBuild(
    path.join(__dirname, '..', 'client', 'dist'),
    'Client App'
  );
  if (clientResult) results.push(clientResult);
  
  // Check admin build
  const adminResult = analyzeBuild(
    path.join(__dirname, '..', 'admin', 'dist'),
    'Admin App'
  );
  if (adminResult) results.push(adminResult);
  
  // Summary
  if (results.length > 0) {
    console.log(`\n${colors.blue}════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.blue}  Summary${colors.reset}`);
    console.log(`${colors.blue}════════════════════════════════════════${colors.reset}\n`);
    
    results.forEach(result => {
      const sizeEmoji = result.totalSize < 500000 ? '✅' : result.totalSize < 2000000 ? '⚠️' : '🔴';
      console.log(`${sizeEmoji} ${result.name.padEnd(15)} | ${result.formatted.padStart(10)}`);
    });
    
    const totalSize = results.reduce((sum, r) => sum + r.totalSize, 0);
    console.log(`\n${colors.cyan}Total build size: ${formatBytes(totalSize)}${colors.reset}`);
    
    console.log(`\n${colors.green}✓ Bundle analysis completed!${colors.reset}`);
    console.log(`\n${colors.yellow}Tip: Modern apps should be under 500KB for optimal performance!${colors.reset}`);
  }
}

checkBundleSizes();

