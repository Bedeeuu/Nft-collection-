const express = require('express');
const axios = require('axios');
const { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH } = process.env;

const router = express.Router();

// Get collection overview
router.get('/', async (req, res) => {
  try {
    if (!GITHUB_TOKEN || !GITHUB_REPO) {
      return res.status(400).json({ error: 'GitHub configuration is missing' });
    }

    // Get images from GitHub
    const response = await axios.get(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/images`,
      {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json'
        }
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
    res.status(500).json({ error: 'Failed to fetch collection data' });
  }
});

module.exports = router;