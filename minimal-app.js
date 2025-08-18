const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

let PORT = 3000;

// Function to find available port
function findAvailablePort(startPort) {
  return new Promise((resolve) => {
    const server = http.createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

// Simple HTTP server without dependencies
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Enhanced logging
  console.log(`📥 ${req.method} ${pathname} from ${req.connection.remoteAddress || 'unknown'}`);
  if (req.method === 'POST') {
    console.log(`📊 Content-Type: ${req.headers['content-type'] || 'unknown'}`);
    console.log(`📦 Content-Length: ${req.headers['content-length'] || 'unknown'}`);
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Route handling
  if (pathname === '/' || pathname === '/index.html') {
    serveFile('public/index.html', 'text/html', res);
  } else if (pathname === '/api/health') {
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      mode: 'minimal'
    }));
  } else if (pathname === '/api/collection') {
    const demoData = {
      success: true,
      data: {
        totalImages: 2,
        images: [
          {
            name: 'demo_nft_1.jpg',
            downloadUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzY2N2VlYSIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+REVNTyBORlQ8L3RleHQ+PC9zdmc+',
            size: 1024
          },
          {
            name: 'demo_nft_2.jpg',
            downloadUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzc2NGJhMiIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+REVNTyBORlQ8L3RleHQ+PC9zdmc+',
            size: 2048
          }
        ],
        message: 'Minimal demo mode - no external dependencies required!'
      }
    };
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(demoData));
  } else if (pathname === '/api/upload') {
    if (req.method === 'POST') {
      console.log('📥 Upload request received');
      
      // Handle file upload with better error handling
      let body = Buffer.alloc(0);
      
      req.on('data', chunk => {
        body = Buffer.concat([body, chunk]);
      });

      req.on('end', () => {
        try {
          console.log('📊 Received data size:', body.length, 'bytes');
          
          // Convert to string for parsing
          const bodyString = body.toString('binary');
          
          // Simple parsing for demo
          let filename = 'uploaded_image.jpg';
          let customName = '';
          
          // Extract filename more safely
          try {
            const filenameMatch = bodyString.match(/filename="([^"]+)"/);
            if (filenameMatch && filenameMatch[1]) {
              filename = filenameMatch[1];
              console.log('📁 Filename extracted:', filename);
            }
          } catch (e) {
            console.log('⚠️ Could not extract filename, using default');
          }
          
          // Extract custom name more safely
          try {
            const nameMatch = bodyString.match(/name="customName"[\s\S]*?\r\n\r\n([^\r\n]*)/);
            if (nameMatch && nameMatch[1] && nameMatch[1].trim()) {
              customName = nameMatch[1].trim();
              console.log('🏷️ Custom name extracted:', customName);
            }
          } catch (e) {
            console.log('⚠️ Could not extract custom name');
          }

          const timestamp = Date.now();
          const nftName = customName || `NFT_${timestamp}`;
          
          console.log('🎨 Creating NFT:', nftName);
          
          // Generate different descriptions based on filename/type
          const descriptions = [
            `${nftName} - A stunning digital masterpiece featuring vibrant colors and exceptional artistic composition. This unique NFT showcases innovative design elements that capture the essence of modern digital art.`,
            `${nftName} - An extraordinary piece of crypto art with intricate details and harmonious color palette. This one-of-a-kind creation represents the future of blockchain-based artistic expression.`,
            `${nftName} - A beautiful and rare digital artwork that combines creativity with technical excellence. This NFT demonstrates the perfect fusion of art and technology in the Web3 space.`,
            `${nftName} - A captivating digital creation with unique visual elements and artistic flair. This collectible NFT embodies the spirit of decentralized creativity and innovation.`
          ];
          
          const description = descriptions[Math.floor(Math.random() * descriptions.length)];
          
          // Create a base64 representation of uploaded image (placeholder)
          const colors = ['#667eea', '#764ba2', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];
          const color1 = colors[Math.floor(Math.random() * colors.length)];
          const color2 = colors[Math.floor(Math.random() * colors.length)];
          
          const svgImage = `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect width="300" height="300" fill="url(#g)"/>
            <text x="150" y="120" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">🎨 ${nftName}</text>
            <text x="150" y="140" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle">Uploaded: ${filename}</text>
            <text x="150" y="180" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle">✨ Unique NFT ✨</text>
            <text x="150" y="200" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle">Created: ${new Date().toLocaleDateString()}</text>
          </svg>`;
          
          const imageUrl = `data:image/svg+xml;base64,${Buffer.from(svgImage).toString('base64')}`;

          const response = {
            success: true,
            data: {
              name: nftName,
              description: description,
              imageUrl: imageUrl,
              metadata: {
                name: nftName,
                description: description,
                image: imageUrl,
                attributes: [
                  { trait_type: "Upload Type", value: "File Upload" },
                  { trait_type: "Original Filename", value: filename },
                  { trait_type: "Created", value: new Date().toISOString() },
                  { trait_type: "Mode", value: "Minimal Server" },
                  { trait_type: "Rarity", value: "Unique" }
                ],
                external_url: "https://github.com/Bedeeuu/Nft-collection-",
                background_color: color1.replace('#', ''),
                animation_url: null,
                youtube_url: null
              }
            }
          };

          console.log(`✅ NFT created successfully: ${nftName} from file: ${filename}`);
          res.writeHead(200, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(JSON.stringify(response));
          
        } catch (error) {
          console.error('❌ Error processing upload:', error.message);
          console.error('Stack trace:', error.stack);
          res.writeHead(500, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(JSON.stringify({
            success: false,
            error: 'Error processing upload: ' + error.message,
            details: error.stack
          }));
        }
      });

      req.on('error', (error) => {
        console.error('❌ Request error:', error);
        res.writeHead(500, { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({
          success: false,
          error: 'Request error: ' + error.message
        }));
      });
      
    } else {
      // Only allow POST for upload
      res.writeHead(405, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({
        success: false,
        error: 'Method not allowed. Use POST.'
      }));
    }
  } else {
    // 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

function serveFile(filePath, contentType, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
}

// Start server with automatic port detection
(async () => {
  try {
    PORT = await findAvailablePort(PORT);
    
    server.listen(PORT, () => {
      console.log('🚀 Minimal NFT Collection App running!');
      console.log(`📱 Open: http://localhost:${PORT}`);
      console.log('✅ No external dependencies required!');
      console.log('⭐ This version works with just Node.js built-in modules');
      console.log('');
      console.log('🎯 Ready to create NFTs! Open the URL above in your browser.');
    });

    server.on('error', (err) => {
      console.error('❌ Server error:', err.message);
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use. Trying next port...`);
        findAvailablePort(PORT + 1).then(newPort => {
          PORT = newPort;
          server.listen(PORT);
        });
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
  }
})();
