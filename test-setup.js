const path = require('path');
const fs = require('fs');

console.log('🔍 Checking project structure...');
console.log('Current directory:', process.cwd());
console.log('Node.js version:', process.version);

// Check if required files exist
const requiredFiles = ['package.json', 'app.js', '.env'];
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Check environment variables
require('dotenv').config();
console.log('\n🔧 Environment check:');
console.log('PORT:', process.env.PORT || '3000');
console.log('GITHUB_TOKEN configured:', !!process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN !== 'your_github_personal_access_token');
console.log('GITHUB_REPO:', process.env.GITHUB_REPO);
console.log('HF_TOKEN configured:', !!process.env.HF_TOKEN && process.env.HF_TOKEN !== 'your_huggingface_token');

console.log('\n🚀 Starting server test...');

try {
  const express = require('express');
  const app = express();
  
  app.get('/test', (req, res) => {
    res.json({ status: 'working', timestamp: new Date().toISOString() });
  });
  
  const server = app.listen(3001, () => {
    console.log('✅ Test server running on http://localhost:3001/test');
    console.log('✅ Basic functionality working!');
    server.close();
  });
} catch (error) {
  console.error('❌ Error:', error.message);
}
