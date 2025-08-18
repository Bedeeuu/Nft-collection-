const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const AIService = require('../services/aiService');
const GitHubService = require('../services/githubService');
const NFTStorageService = require('../services/nftStorageService');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload and process image
router.post('/', upload.single('image'), async (req, res) => {
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
    if (generateIPFS && NFTStorageService) {
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

module.exports = router;