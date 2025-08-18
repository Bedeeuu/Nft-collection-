console.log('🚀 Starting INSTANT NFT Server...');

const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  console.log(`📥 ${req.method} ${req.url}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>NFT Server Works!</title></head>
      <body>
        <h1>🎉 NFT Server is Running!</h1>
        <p>✅ Server is working on port 3000</p>
        <button onclick="testUpload()">Test Upload</button>
        <div id="result"></div>
        <script>
          async function testUpload() {
            try {
              const formData = new FormData();
              formData.append('test', 'data');
              const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
              });
              const data = await response.json();
              document.getElementById('result').innerHTML = 
                '<h3>✅ Upload Test Result:</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
            } catch (error) {
              document.getElementById('result').innerHTML = 
                '<h3>❌ Upload Test Error:</h3><p>' + error.message + '</p>';
            }
          }
        </script>
      </body>
      </html>
    `);
    return;
  }

  if (req.url === '/api/upload' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const response = {
        success: true,
        data: {
          name: 'Instant_NFT_' + Date.now(),
          description: 'NFT created by instant server - upload test successful!',
          imageUrl: 'data:image/svg+xml;base64,' + Buffer.from(`
            <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
              <rect width="200" height="200" fill="#00FF44"/>
              <text x="100" y="100" font-family="Arial" font-size="16" fill="white" text-anchor="middle">✅ SUCCESS</text>
              <text x="100" y="120" font-family="Arial" font-size="12" fill="white" text-anchor="middle">Upload Works!</text>
            </svg>
          `).toString('base64'),
          metadata: { name: 'Test NFT', success: true }
        }
      };
      
      console.log('✅ Upload successful:', response.data.name);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end('{"error":"Route not found","url":"' + req.url + '"}');
});

server.listen(3000, () => {
  console.log('✅ INSTANT NFT Server running on http://localhost:3000');
  console.log('🌐 Open: http://localhost:3000');
  console.log('🔧 Server ready for testing!');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('⚠️  Port 3000 is busy, trying port 3001...');
    server.listen(3001, () => {
      console.log('✅ Server running on http://localhost:3001');
    });
  } else {
    console.error('❌ Server error:', err);
  }
});
