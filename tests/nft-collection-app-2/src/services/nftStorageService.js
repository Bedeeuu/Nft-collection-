const axios = require('axios');

class NFTStorageService {
  static async uploadToIPFS(content, filename) {
    const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY;

    if (!NFT_STORAGE_KEY) {
      throw new Error('NFT Storage key not configured');
    }

    const formData = new FormData();
    formData.append('file', new Blob([content]), filename);

    try {
      const response = await axios.post('https://api.nft.storage/upload', formData, {
        headers: {
          'Authorization': `Bearer ${NFT_STORAGE_KEY}`,
          ...formData.getHeaders()
        }
      });

      return {
        cid: response.data.value.cid,
        ipfsUrl: `https://ipfs.io/ipfs/${response.data.value.cid}`
      };
    } catch (error) {
      console.error('Error uploading to IPFS:', error.message);
      throw error;
    }
  }
}

module.exports = NFTStorageService;