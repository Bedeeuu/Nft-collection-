const dotenv = require('dotenv');

dotenv.config();

const environment = {
  PORT: process.env.PORT || 3000,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  GITHUB_REPO: process.env.GITHUB_REPO,
  GITHUB_BRANCH: process.env.GITHUB_BRANCH || 'main',
  HF_TOKEN: process.env.HF_TOKEN,
  NFT_STORAGE_KEY: process.env.NFT_STORAGE_KEY,
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
};

module.exports = environment;