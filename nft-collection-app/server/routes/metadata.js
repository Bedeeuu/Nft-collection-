const express = require('express');
const router = express.Router();
const { generateMetadata } = require('../../utils/metadata-generator');

// Route to generate NFT metadata
router.post('/generate', async (req, res) => {
    try {
        const imagePath = req.body.imagePath;
        const metadata = await generateMetadata(imagePath);
        
        if (metadata) {
            res.status(200).json(metadata);
        } else {
            res.status(400).json({ error: 'Metadata generation failed' });
        }
    } catch (error) {
        console.error('Error generating metadata:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to retrieve NFT metadata (example)
router.get('/:id', (req, res) => {
    const metadataId = req.params.id;
    // Logic to retrieve metadata by ID would go here
    res.status(200).json({ message: `Metadata for NFT ID: ${metadataId}` });
});

module.exports = router;