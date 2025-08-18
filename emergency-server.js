const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🔧 Starting EMERGENCY Simple Server...');

const server = http.createServer((req, res) => {
  // CORS headers first
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  console.log(`📥 ${req.method} ${req.url} (full URL)`);
  console.log(`📋 Headers:`, req.headers);

  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    console.log('✅ Handling OPTIONS (CORS preflight)');
    res.writeHead(200);
    res.end();
    return;
  }

  // Parse URL properly
  const urlParts = req.url.split('?');
  const pathname = urlParts[0];
  console.log(`🎯 Pathname: "${pathname}"`);

  // Handle main page
  if (pathname === '/' || pathname === '/index.html') {
    console.log('📄 Serving index.html');
    try {
      const indexPath = path.join(__dirname, 'public', 'index.html');
      const content = fs.readFileSync(indexPath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    } catch (error) {
      console.error('❌ Error serving index:', error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error loading page');
    }
    return;
  }

  // Emergency test page
  if (pathname === '/emergency-test.html') {
    console.log('🚨 Serving emergency test page');
    try {
      const testPath = path.join(__dirname, 'emergency-test.html');
      const content = fs.readFileSync(testPath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    } catch (error) {
      console.error('❌ Error serving test page:', error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error loading test page');
    }
    return;
  }

  // Health check
  if (pathname === '/api/health') {
    console.log('💚 Health check requested');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('{"status":"ok","mode":"emergency","timestamp":"' + new Date().toISOString() + '"}');
    return;
  }

  // Collection
  if (pathname === '/api/collection') {
    console.log('📚 Collection requested');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('{"success":true,"data":{"images":[]}}');
    return;
  }

  // Upload - EMERGENCY SIMPLE VERSION
  if (pathname === '/api/upload') {
    if (req.method !== 'POST') {
      console.log(`❌ Upload: Wrong method ${req.method}, expected POST`);
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end('{"success":false,"error":"Method not allowed, use POST"}');
      return;
    }

    console.log('🚨 EMERGENCY Upload handler - POST method confirmed');
    
    // Don't try to parse anything, just drain the request
    let dataSize = 0;
    req.on('data', (chunk) => {
      dataSize += chunk.length;
      console.log(`📦 Received chunk: ${chunk.length} bytes, total: ${dataSize}`);
    });
    
    req.on('end', () => {
      console.log(`✅ Request completed, total size: ${dataSize} bytes`);
      console.log('🔄 Sending emergency response...');
      
      // Send minimal successful response
      const simpleResponse = {
        "success": true,
        "data": {
          "name": "Emergency_NFT_" + Date.now(),
          "description": "Emergency mode NFT - server is working! Received " + dataSize + " bytes of data.",
          "imageUrl": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwRkY0NCIvPjx0ZXh0IHg9IjEwMCIgeT0iODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfmoE8L3RleHQ+PHRleHQgeD0iMTAwIiB5PSIxMTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkVNRVJHRU5DWTwvdGV4dD48dGV4dCB4PSIxMDAiIHk9IjEzMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U0VSVkVSPC90ZXh0Pjx0ZXh0IHg9IjEwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5XT1JLSU5HPC90ZXh0Pjx0ZXh0IHg9IjEwMCIgeT0iMTcwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjIwMjUtMDgtMTQ8L3RleHQ+PC9zdmc+",
          "metadata": {
            "name": "Emergency_NFT_" + Date.now(),
            "description": "Emergency test NFT",
            "attributes": [
              { "trait_type": "Mode", "value": "Emergency" },
              { "trait_type": "Data_Size", "value": dataSize + " bytes" },
              { "trait_type": "Status", "value": "Working" }
            ]
          }
        }
      };
      
      console.log('📤 Sending response with NFT name:', simpleResponse.data.name);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(simpleResponse));
    });
    
    req.on('error', (err) => {
      console.error('❌ Request error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end('{"success":false,"error":"Request error: ' + err.message + '"}');
    });
    
    return;
  }

  // 404 for everything else - with detailed info
  console.log(`❌ Route not found: "${pathname}"`);
  console.log('📝 Available routes:');
  console.log('   GET  /');
  console.log('   GET  /index.html');
  console.log('   GET  /emergency-test.html');
  console.log('   GET  /api/health');
  console.log('   GET  /api/collection');
  console.log('   POST /api/upload');
  
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    "success": false,
    "error": "Route not found",
    "requested": pathname,
    "method": req.method,
    "available_routes": [
      "GET /",
      "GET /index.html", 
      "GET /emergency-test.html",
      "GET /api/health",
      "GET /api/collection",
      "POST /api/upload"
    ]
  }));
});

// Start server
const port = 3000;
server.listen(port, (err) => {
  if (err) {
    console.error('❌ Server start error:', err);
    process.exit(1);
  } else {
    console.log('✅ EMERGENCY SERVER RUNNING');
    console.log(`🌐 URL: http://localhost:${port}`);
    console.log('🔧 This version has ZERO complex logic');
  }
});

// Error handling
server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled rejection:', err);
});
