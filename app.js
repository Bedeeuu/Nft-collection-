const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'));
    }
  }
});

// Environment variables
const {
  GITHUB_TOKEN,
  GITHUB_REPO,
  GITHUB_BRANCH = 'main',
  HF_TOKEN,
  NFT_STORAGE_KEY,
  TELEGRAM_TOKEN
} = process.env;

// GitHub API configuration
const githubHeaders = {
  'Authorization': `Bearer ${GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github+json',
  'Content-Type': 'application/json'
};

// AI Services
class AIService {
  static async generateBasicCaption(imageBuffer) {
    // Fallback description if HF API is not available
    if (!HF_TOKEN || HF_TOKEN === 'your_huggingface_token') {
      return 'A beautiful digital artwork suitable for NFT collection';
    }
    
    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning',
        imageBuffer,
        {
          headers: {
            'Authorization': `Bearer ${HF_TOKEN}`,
            'Content-Type': 'application/octet-stream'
          },
          timeout: 10000 // 10 second timeout
        }
      );
      return response.data[0]?.generated_text || 'A unique digital artwork';
    } catch (error) {
      console.error('Error generating basic caption:', error.message);
      return 'A stunning digital artwork with vibrant colors and artistic composition, perfect for NFT collection';
    }
  }

  static async generateRichDescription(basicCaption) {
    // Enhanced fallback descriptions
    const fallbackDescriptions = [
      `${basicCaption}. This unique piece features intricate details and masterful composition, making it a valuable addition to any NFT collection.`,
      `${basicCaption}. The artwork showcases exceptional creativity with harmonious color palette and innovative design elements.`,
      `${basicCaption}. A one-of-a-kind digital masterpiece that captures the essence of modern crypto art with its distinctive style and visual appeal.`
    ];
    
    if (!HF_TOKEN || HF_TOKEN === 'your_huggingface_token') {
      return fallbackDescriptions[Math.floor(Math.random() * fallbackDescriptions.length)];
    }

    try {
      const payload = {
        inputs: `Create a detailed, artistic description for an NFT including colors, mood, style, and artistic elements: ${basicCaption}`,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.8,
          top_p: 0.9
        }
      };

      const response = await axios.post(
        'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
        payload,
        {
          headers: {
            'Authorization': `Bearer ${HF_TOKEN}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000 // 15 second timeout
        }
      );

      if (Array.isArray(response.data)) {
        return response.data[0]?.generated_text || fallbackDescriptions[0];
      }
      return response.data?.generated_text || fallbackDescriptions[0];
    } catch (error) {
      console.error('Error generating rich description:', error.message);
      return fallbackDescriptions[Math.floor(Math.random() * fallbackDescriptions.length)];
    }
  }

  static async analyzeWithVLM(imageUrl, question) {
    if (!HF_TOKEN || HF_TOKEN === 'your_huggingface_token') {
      return 'This feature requires a valid Hugging Face API token. Please configure your .env file.';
    }

    try {
      const payload = [{
        role: "user",
        content: [
          { type: "image", url: imageUrl },
          { type: "text", text: question }
        ]
      }];

      const response = await axios.post(
        'https://api-inference.huggingface.co/models/HuggingFaceTB/SmolVLM-Instruct',
        payload,
        {
          headers: {
            'Authorization': `Bearer ${HF_TOKEN}`,
            'Content-Type': 'application/json'
          },
          timeout: 20000 // 20 second timeout
        }
      );

      return response.data[0]?.generated_text || 'Unable to analyze image at this time';
    } catch (error) {
      console.error('Error with VLM analysis:', error.message);
      return 'Error analyzing image. Please check your API configuration or try again later.';
    }
  }
}

// GitHub Service
class GitHubService {
  static async uploadFile(filename, content, directory = 'images') {
    if (!GITHUB_TOKEN || GITHUB_TOKEN === 'your_github_personal_access_token' || !GITHUB_REPO || GITHUB_REPO === 'your_username/your_repo_name') {
      console.log('GitHub upload skipped - no valid configuration');
      // Return a local file URL for demo purposes
      return `data:image/jpeg;base64,${Buffer.from(content).toString('base64')}`;
    }

    const path = `${directory}/${filename}`;
    const encodedContent = Buffer.from(content).toString('base64');

    try {
      const payload = {
        message: `Add ${filename}`,
        content: encodedContent,
        branch: GITHUB_BRANCH
      };

      await axios.put(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`,
        payload,
        { 
          headers: githubHeaders,
          timeout: 10000 // 10 second timeout
        }
      );

      return `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}`;
    } catch (error) {
      if (error.response?.status === 409) {
        // File exists, update it
        try {
          const existing = await axios.get(
            `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`,
            { 
              headers: githubHeaders,
              timeout: 10000
            }
          );

          payload.sha = existing.data.sha;
          await axios.put(
            `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`,
            payload,
            { 
              headers: githubHeaders,
              timeout: 10000
            }
          );

          return `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}`;
        } catch (updateError) {
          console.error('Error updating file:', updateError.message);
          return `data:image/jpeg;base64,${Buffer.from(content).toString('base64')}`;
        }
      }
      console.error('Error uploading to GitHub:', error.message);
      return `data:image/jpeg;base64,${Buffer.from(content).toString('base64')}`;
    }
  }

  static async createNFTMetadata(name, description, imageUrl, attributes = []) {
    const metadata = {
      name,
      description,
      image: imageUrl,
      attributes,
      created: new Date().toISOString(),
      creator: "NFT Collection App",
      external_url: "https://github.com/Bedeeuu/Nft-collection-",
      background_color: "000000"
    };

    const filename = `${name.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    const jsonContent = JSON.stringify(metadata, null, 2);

    try {
      const metadataUrl = await this.uploadFile(filename, jsonContent, 'metadata');
      return { metadata, metadataUrl };
    } catch (error) {
      console.error('Error creating metadata:', error.message);
      // Return metadata without upload
      return { 
        metadata, 
        metadataUrl: `data:application/json;base64,${Buffer.from(jsonContent).toString('base64')}` 
      };
    }
  }
}

// NFT Storage Service
class NFTStorageService {
  static async uploadToIPFS(content, filename) {
    if (!NFT_STORAGE_KEY) {
      throw new Error('NFT Storage key not configured');
    }

    const formData = new FormData();
    formData.append('file', new Blob([content]), filename);

    try {
      const response = await fetch('https://api.nft.storage/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NFT_STORAGE_KEY}`
        },
        body: formData
      });

      const result = await response.json();
      return {
        cid: result.value.cid,
        ipfsUrl: `https://ipfs.io/ipfs/${result.value.cid}`
      };
    } catch (error) {
      console.error('Error uploading to IPFS:', error.message);
      throw error;
    }
  }
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    services: {
      github: !!GITHUB_TOKEN,
      huggingface: !!HF_TOKEN,
      nftStorage: !!NFT_STORAGE_KEY,
      telegram: !!TELEGRAM_TOKEN
    }
  });
});

// Upload and process image
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const { customName, generateIPFS = false } = req.body;
    const imageBuffer = req.file.buffer;
    
    // Generate unique filename
    const fileId = uuidv4().slice(0, 8);
    const baseName = customName || `NFT_${fileId}`;
    const filename = `${baseName}.${req.file.originalname.split('.').pop()}`;

    // Optimize image
    const optimizedBuffer = await sharp(imageBuffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer();

    // Upload image to GitHub
    const imageUrl = await GitHubService.uploadFile(filename, optimizedBuffer);

    // Generate AI description
    const basicCaption = await AIService.generateBasicCaption(optimizedBuffer);
    const richDescription = await AIService.generateRichDescription(basicCaption);

    // Create NFT metadata
    const attributes = [
      { trait_type: "Style", value: "AI Generated" },
      { trait_type: "Size", value: `${req.file.size} bytes` },
      { trait_type: "Type", value: req.file.mimetype }
    ];

    const { metadata, metadataUrl } = await GitHubService.createNFTMetadata(
      baseName,
      richDescription,
      imageUrl,
      attributes
    );

    // Optional IPFS upload
    let ipfsData = null;
    if (generateIPFS && NFT_STORAGE_KEY) {
      try {
        const [imageIPFS, metadataIPFS] = await Promise.all([
          NFTStorageService.uploadToIPFS(optimizedBuffer, filename),
          NFTStorageService.uploadToIPFS(JSON.stringify(metadata), `${baseName}.json`)
        ]);
        ipfsData = { image: imageIPFS, metadata: metadataIPFS };
      } catch (error) {
        console.error('IPFS upload failed:', error.message);
      }
    }

    res.json({
      success: true,
      data: {
        name: baseName,
        description: richDescription,
        imageUrl,
        metadataUrl,
        metadata,
        ipfs: ipfsData
      }
    });

  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

// Analyze image with custom question
app.post('/api/analyze', async (req, res) => {
  try {
    const { imageUrl, question } = req.body;

    if (!imageUrl || !question) {
      return res.status(400).json({ error: 'Image URL and question are required' });
    }

    const analysis = await AIService.analyzeWithVLM(imageUrl, question);
    
    res.json({
      success: true,
      data: {
        question,
        analysis
      }
    });

  } catch (error) {
    console.error('Analysis error:', error.message);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

// Get collection overview
app.get('/api/collection', async (req, res) => {
  try {
    if (!GITHUB_TOKEN || GITHUB_TOKEN === 'your_github_personal_access_token' || !GITHUB_REPO || GITHUB_REPO === 'your_username/your_repo_name') {
      // Return demo collection data when GitHub is not configured
      const demoImages = [
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
      ];

      return res.json({
        success: true,
        data: {
          totalImages: demoImages.length,
          images: demoImages,
          message: 'Demo mode - configure GitHub tokens for real collection'
        }
      });
    }

    // Get images from GitHub
    const response = await axios.get(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/images`,
      { 
        headers: githubHeaders,
        timeout: 10000
      }
    );

    const images = response.data
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file.name))
      .map(file => ({
        name: file.name,
        downloadUrl: file.download_url,
        size: file.size
      }));

    res.json({
      success: true,
      data: {
        totalImages: images.length,
        images: images.slice(0, 50) // Limit to 50 for performance
      }
    });

  } catch (error) {
    console.error('Collection fetch error:', error.message);
    
    // Fallback to demo data on error
    const demoImages = [
      {
        name: 'example_nft.jpg',
        downloadUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Db25maWd1cmUgR2l0SHViPC90ZXh0Pjwvc3ZnPg==',
        size: 1024
      }
    ];

    res.json({
      success: true,
      data: {
        totalImages: demoImages.length,
        images: demoImages,
        error: 'Failed to fetch from GitHub. Using demo data.'
      }
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 NFT Collection App running on port ${PORT}`);
  console.log(`📱 Web interface: http://localhost:${PORT}`);
  console.log(`🔧 API endpoint: http://localhost:${PORT}/api`);
  
  // Check environment
  if (!GITHUB_TOKEN || !HF_TOKEN) {
    console.warn('⚠️  Warning: Missing required environment variables');
  }
});

module.exports = app;
