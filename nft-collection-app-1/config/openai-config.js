const OPENAI_CONFIG = {
    apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here',
    model: 'gpt-4-vision-preview',
    maxTokens: 500
};

module.exports = OPENAI_CONFIG;