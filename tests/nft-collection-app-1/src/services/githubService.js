class GitHubService {
  static async uploadFile(filename, content, directory = 'images') {
    if (!process.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN === 'your_github_personal_access_token' || !process.env.GITHUB_REPO || process.env.GITHUB_REPO === 'your_username/your_repo_name') {
      console.log('GitHub upload skipped - no valid configuration');
      return `data:image/jpeg;base64,${Buffer.from(content).toString('base64')}`;
    }

    const path = `${directory}/${filename}`;
    const encodedContent = Buffer.from(content).toString('base64');

    try {
      const payload = {
        message: `Add ${filename}`,
        content: encodedContent,
        branch: process.env.GITHUB_BRANCH || 'main'
      };

      await axios.put(
        `https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/${path}`,
        payload,
        { 
          headers: {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github+json',
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      return `https://raw.githubusercontent.com/${process.env.GITHUB_REPO}/${process.env.GITHUB_BRANCH || 'main'}/${path}`;
    } catch (error) {
      if (error.response?.status === 409) {
        try {
          const existing = await axios.get(
            `https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/${path}`,
            { 
              headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github+json',
                'Content-Type': 'application/json'
              },
              timeout: 10000
            }
          );

          payload.sha = existing.data.sha;
          await axios.put(
            `https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/${path}`,
            payload,
            { 
              headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github+json',
                'Content-Type': 'application/json'
              },
              timeout: 10000
            }
          );

          return `https://raw.githubusercontent.com/${process.env.GITHUB_REPO}/${process.env.GITHUB_BRANCH || 'main'}/${path}`;
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
      return { 
        metadata, 
        metadataUrl: `data:application/json;base64,${Buffer.from(jsonContent).toString('base64')}` 
      };
    }
  }
}

module.exports = GitHubService;