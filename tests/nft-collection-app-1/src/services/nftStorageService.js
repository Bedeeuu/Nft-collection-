class NFTStorageService {
  static async uploadToIPFS(content, filename) {
    if (!process.env.NFT_STORAGE_KEY) {
      throw new Error('NFT Storage key not configured');
    }

    const formData = new FormData();
    formData.append('file', new Blob([content]), filename);

    try {
      const response = await fetch('https://api.nft.storage/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NFT_STORAGE_KEY}`
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

module.exports = NFTStorageService;