const express = require('express');
const AIService = require('../services/aiService');

class AnalyzeController {
  static async analyzeImage(req, res) {
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
  }
}

module.exports = AnalyzeController;