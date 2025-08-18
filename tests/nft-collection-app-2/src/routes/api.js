const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const analyzeController = require('../controllers/analyzeController');
const collectionController = require('../controllers/collectionController');

// Upload image and generate NFT
router.post('/upload', uploadController.uploadImage);

// Analyze image with AI
router.post('/analyze', analyzeController.analyzeImage);

// Get NFT collection overview
router.get('/collection', collectionController.getCollectionOverview);

module.exports = router;