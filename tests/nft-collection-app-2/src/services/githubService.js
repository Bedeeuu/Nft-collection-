const axios = require('axios');
require('dotenv').config();

class GitHubService {
  constructor() {
    this.token = process.env.GITHUB_TOKEN;
    this.repo = process.env.GITHUB_REPO;
    this.branch = process.env.GITHUB_BRANCH || 'main';
    this.headers = {
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json'
    };
  }

  async uploadFile(filename, content, directory = 'images') {
    if (!this.token || !this.repo) {
      console.log('GitHub upload skipped - no valid configuration');
      return `data:image/jpeg;base64,${Buffer.from(content).toString('base64')}`;
    }

    const path = `${directory}/${filename}`;
    const encodedContent = Buffer.from(content).toString('base64');

    try {
      const payload = {
        message: `Add ${filename}`,
        content: encodedContent,
        branch: this.branch
      };

      await axios.put(
        `https://api.github.com/repos/${this.repo}/contents/${path}`,
        payload,
        { headers: this.headers }
      );

      return `https://raw.githubusercontent.com/${this.repo}/${this.branch}/${path}`;
    } catch (error) {
      if (error.response?.status === 409) {
        try {
          const existing = await axios.get(
            `https://api.github.com/repos/${this.repo}/contents/${path}`,
            { headers: this.headers }
          );

          payload.sha = existing.data.sha;
          await axios.put(
            `https://api.github.com/repos/${this.repo}/contents/${path}`,
            payload,
            { headers: this.headers }
          );

          return `https://raw.githubusercontent.com/${this.repo}/${this.branch}/${path}`;
        } catch (updateError) {
          console.error('Error updating file:', updateError.message);
          return `data:image/jpeg;base64,${Buffer.from(content).toString('base64')}`;
        }
      }
      console.error('Error uploading to GitHub:', error.message);
      return `data:image/jpeg;base64,${Buffer.from(content).toString('base64')}`;
    }
  }

  async createNFTMetadata(name, description, imageUrl, attributes = []) {
    const metadata = {
      name,
      description,
      image: imageUrl,
      attributes,
      created: new Date().toISOString(),
      creator: "NFT Collection App",
      external_url: "https://github.com/your_username/nft-collection-app",
      background_color: "000000"
    };

    const filename = `${name.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    const jsonContent = JSON.stringify(metadata, null, 2);

    try {
      const metadataUrl = await this.uploadFile(filename, jsonContent, 'metadata');
      return { metadata, metadataUrl };
    } catch (error) {
      console.error('Error creating metadata:', error.message);
      return { 
        metadata, 
        metadataUrl: `data:application/json;base64,${Buffer.from(jsonContent).toString('base64')}` 
      };
    }
  }
}

module.exports = new GitHubService();