class AIService {
  static async generateBasicCaption(imageBuffer) {
    // Fallback description if HF API is not available
    if (!process.env.HF_TOKEN || process.env.HF_TOKEN === 'your_huggingface_token') {
      return 'A beautiful digital artwork suitable for NFT collection';
    }
    
    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning',
        imageBuffer,
        {
          headers: {
            'Authorization': `Bearer ${process.env.HF_TOKEN}`,
            'Content-Type': 'application/octet-stream'
          },
          timeout: 10000 // 10 second timeout
        }
      );
      return response.data[0]?.generated_text || 'A unique digital artwork';
    } catch (error) {
      console.error('Error generating basic caption:', error.message);
      return 'A stunning digital artwork with vibrant colors and artistic composition, perfect for NFT collection';
    }
  }

  static async generateRichDescription(basicCaption) {
    // Enhanced fallback descriptions
    const fallbackDescriptions = [
      `${basicCaption}. This unique piece features intricate details and masterful composition, making it a valuable addition to any NFT collection.`,
      `${basicCaption}. The artwork showcases exceptional creativity with harmonious color palette and innovative design elements.`,
      `${basicCaption}. A one-of-a-kind digital masterpiece that captures the essence of modern crypto art with its distinctive style and visual appeal.`
    ];
    
    if (!process.env.HF_TOKEN || process.env.HF_TOKEN === 'your_huggingface_token') {
      return fallbackDescriptions[Math.floor(Math.random() * fallbackDescriptions.length)];
    }

    try {
      const payload = {
        inputs: `Create a detailed, artistic description for an NFT including colors, mood, style, and artistic elements: ${basicCaption}`,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.8,
          top_p: 0.9
        }
      };

      const response = await axios.post(
        'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
        payload,
        {
          headers: {
            'Authorization': `Bearer ${process.env.HF_TOKEN}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000 // 15 second timeout
        }
      );

      if (Array.isArray(response.data)) {
        return response.data[0]?.generated_text || fallbackDescriptions[0];
      }
      return response.data?.generated_text || fallbackDescriptions[0];
    } catch (error) {
      console.error('Error generating rich description:', error.message);
      return fallbackDescriptions[Math.floor(Math.random() * fallbackDescriptions.length)];
    }
  }

  static async analyzeWithVLM(imageUrl, question) {
    if (!process.env.HF_TOKEN || process.env.HF_TOKEN === 'your_huggingface_token') {
      return 'This feature requires a valid Hugging Face API token. Please configure your .env file.';
    }

    try {
      const payload = [{
        role: "user",
        content: [
          { type: "image", url: imageUrl },
          { type: "text", text: question }
        ]
      }];

      const response = await axios.post(
        'https://api-inference.huggingface.co/models/HuggingFaceTB/SmolVLM-Instruct',
        payload,
        {
          headers: {
            'Authorization': `Bearer ${process.env.HF_TOKEN}`,
            'Content-Type': 'application/json'
          },
          timeout: 20000 // 20 second timeout
        }
      );

      return response.data[0]?.generated_text || 'Unable to analyze image at this time';
    } catch (error) {
      console.error('Error with VLM analysis:', error.message);
      return 'Error analyzing image. Please check your API configuration or try again later.';
    }
  }
}

module.exports = AIService;