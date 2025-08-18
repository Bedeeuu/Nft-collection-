class AIService {
  static async generateBasicCaption(imageBuffer) {
    // Fallback description if AI service is not available
    return 'A beautiful digital artwork suitable for NFT collection';
  }

  static async generateRichDescription(basicCaption) {
    // Enhanced fallback descriptions
    const fallbackDescriptions = [
      `${basicCaption}. This unique piece features intricate details and masterful composition, making it a valuable addition to any NFT collection.`,
      `${basicCaption}. The artwork showcases exceptional creativity with harmonious color palette and innovative design elements.`,
      `${basicCaption}. A one-of-a-kind digital masterpiece that captures the essence of modern crypto art with its distinctive style and visual appeal.`
    ];
    
    return fallbackDescriptions[Math.floor(Math.random() * fallbackDescriptions.length)];
  }

  static async analyzeWithVLM(imageUrl, question) {
    return 'This feature requires a valid AI service configuration. Please check your setup.';
  }
}

module.exports = AIService;