const express = require('express');
const AIService = require('../services/aiService');

const router = express.Router();

// Analyze image with custom question
router.post('/', async (req, res) => {
  try {
    const { imageUrl, question } = req.body;

    if (!imageUrl || !question) {
      return res.status(400).json({ error: 'Image URL and question are required' });
    }

    const analysis = await AIService.analyzeWithVLM(imageUrl, question);
    
    res.json({
      success: true,
      data: {
        question,
        analysis
      }
    });

  } catch (error) {
    console.error('Analysis error:', error.message);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

module.exports = router;