const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Server variable to track the current image
let currentServerImagePath = null;

// Function to load environment variables from a file
function loadEnvVariables() {
    try {
        const envPath = path.join(__dirname, '../config/.env');
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf-8');
            envConfig.split('\n').forEach(line => {
                const [key, value] = line.split('=');
                process.env[key.trim()] = value.trim();
            });
        } else {
            console.warn('⚠️ .env file not found, using default values.');
        }
    } catch (error) {
        console.log('⚠️ Error loading environment variables:', error.message);
    }
}

// Load environment variables
loadEnvVariables();

// OpenAI API configuration
const OPENAI_CONFIG = {
    apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here',
    model: 'gpt-4-vision-preview',
    maxTokens: 500
};

// Function to analyze an image using OpenAI GPT-4 Vision
async function analyzeImageWithGPT(imagePath) {
    try {
        console.log('🤖 Sending image to OpenAI GPT-4 Vision...');
        
        const fullImagePath = path.join(__dirname, '../uploads/images', imagePath);
        if (!fs.existsSync(fullImagePath)) {
            throw new Error('Image file does not exist.');
        }
        
        const imageBuffer = fs.readFileSync(fullImagePath);
        const base64Image = imageBuffer.toString('base64');
        const imageExtension = path.extname(imagePath).toLowerCase();
        const mimeType = imageExtension === '.png' ? 'image/png' : 'image/jpeg';
        
        const requestData = {
            model: OPENAI_CONFIG.model,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `Analyze this image for creating NFT metadata. Provide a detailed description including:

1. NFT NAME (creative and unique)
2. DESCRIPTION (detailed artistic description of what is depicted)
3. STYLE (artistic style and technique)
4. COLOR PALETTE (main colors and their characteristics)
5. MOOD (emotional atmosphere)
6. ATTRIBUTES (unique characteristics for metadata)

Respond in JSON format:
{
  "name": "NFT Name",
  "description": "Detailed description",
  "style": "Artistic style",
  "colors": "Color palette",
  "mood": "Mood",
  "attributes": ["attribute1", "attribute2", "attribute3"]
}`
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${mimeType};base64,${base64Image}`
                            }
                        }
                    ]
                }
            ],
            max_tokens: OPENAI_CONFIG.maxTokens
        };
        
        const response = await makeOpenAIRequest(requestData);
        
        if (response && response.choices && response.choices[0]) {
            return response.choices[0].message.content;
        } else {
            throw new Error('No valid response from OpenAI.');
        }
        
    } catch (error) {
        console.error('❌ Error analyzing image with OpenAI:', error.message);
        return {
            success: false,
            error: error.message,
            fallback: true
        };
    }
}

// Function to make HTTP request to OpenAI API
function makeOpenAIRequest(data) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(data);
        
        const options = {
            hostname: 'api.openai.com',
            port: 443,
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_CONFIG.apiKey}`,
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            res.on('end', () => {
                resolve(JSON.parse(responseData));
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.write(postData);
        req.end();
    });
}

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Handle static file requests (images)
    if (req.method === 'GET' && req.url.startsWith('/images/')) {
        const imagePath = path.join(__dirname, '../uploads/images', req.url.replace('/images/', ''));
        
        if (fs.existsSync(imagePath)) {
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            fs.createReadStream(imagePath).pipe(res);
        } else {
            res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
            res.end('Image not found');
        }
        return;
    }

    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<h1>Welcome to the NFT Collection Server</h1>');
        return;
    }
    
    if (req.method === 'POST' && req.url === '/generate-description') {
        // Handle description generation logic here
        // Example: analyzeImageWithGPT(req.body.imagePath)
    }
    
    res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
    res.end('Page not found');
});

const PORT = 3005;
server.listen(PORT, () => {
    console.log('🎯 NFT Master running on http://localhost:' + PORT);
    console.log('📝 Full cycle of NFT collection creation');
    console.log('🤖 AI description generator active');
    console.log('📊 ERC-721 metadata creation');
    console.log('🌐 GitHub integration');
    console.log('✨ Automated NFT creation process');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

module.exports = server;