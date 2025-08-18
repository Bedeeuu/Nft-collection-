const axios = require('axios');
const { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH } = process.env;

class CollectionController {
  async getCollection(req, res) {
    try {
      if (!GITHUB_TOKEN || !GITHUB_REPO) {
        return res.status(400).json({ error: 'GitHub configuration is missing' });
      }

      const response = await axios.get(`https://api.github.com/repos/${GITHUB_REPO}/contents/images`, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

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
      console.error('Error fetching collection:', error.message);
      res.status(500).json({ error: 'Failed to fetch collection' });
    }
  }
}

module.exports = new CollectionController();