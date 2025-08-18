const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Ultra-Simple NFT Server...');

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  // Add CORS headers to all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  console.log(`📥 ${req.method} ${url.pathname}`);

  // Handle OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Serve index.html
  if (url.pathname === '/' || url.pathname === '/index.html') {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('index.html not found');
    }
    return;
  }

  // Health check
  if (url.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      mode: 'ultra-simple'
    }));
    return;
  }

  // Collection endpoint
  if (url.pathname === '/api/collection') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      data: { images: [] }
    }));
    return;
  }

  // Upload endpoint - ULTRA SIMPLE
  if (url.pathname === '/api/upload') {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Only POST allowed' }));
      return;
    }

    console.log('🔄 Processing upload...');

    // Just consume the request body and return success
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      console.log('📦 Received data length:', body.length);
      
      // Generate a simple NFT response
      const nftName = `Simple_NFT_${Date.now()}`;
      const response = {
        success: true,
        data: {
          name: nftName,
          description: `${nftName} - A beautiful digital artwork created with ultra-simple server. This NFT demonstrates basic upload functionality without complex processing.`,
          imageUrl: `data:image/svg+xml;base64,${Buffer.from(`
            <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
              <rect width="200" height="200" fill="#4F46E5"/>
              <text x="100" y="100" font-family="Arial" font-size="14" fill="white" text-anchor="middle">🎨</text>
              <text x="100" y="120" font-family="Arial" font-size="12" fill="white" text-anchor="middle">${nftName}</text>
              <text x="100" y="140" font-family="Arial" font-size="10" fill="white" text-anchor="middle">Ultra Simple Mode</text>
            </svg>
          `).toString('base64')}`,
          metadata: {
            name: nftName,
            description: `${nftName} - Ultra simple NFT`,
            attributes: [
              { trait_type: "Mode", value: "Ultra Simple" },
              { trait_type: "Created", value: new Date().toISOString() }
            ]
          }
        }
      };

      console.log('✅ NFT created:', nftName);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: error.message }));
    });

    return;
  }

  // 404 for everything else
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

// Start server with automatic port detection
let port = 3000;
const maxAttempts = 10;

function tryStart(attempt = 1) {
  server.listen(port, (err) => {
    if (err) {
      if (err.code === 'EADDRINUSE' && attempt < maxAttempts) {
        console.log(`⚠️  Port ${port} busy, trying ${port + 1}...`);
        port++;
        server.close(() => tryStart(attempt + 1));
      } else {
        console.error(`❌ Failed to start server: ${err.message}`);
        process.exit(1);
      }
    } else {
      console.log(`✅ Ultra-Simple NFT Server running!`);
      console.log(`🌐 Open: http://localhost:${port}`);
      console.log(`📊 Mode: Ultra Simple (no complex parsing)`);
      console.log(`🔧 Debug: All requests logged to console`);
    }
  });
}

tryStart();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});
