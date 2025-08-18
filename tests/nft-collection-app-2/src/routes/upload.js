const express = require('express');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

// Route for uploading images
router.post('/upload', uploadController.uploadImage);

// Export the router
module.exports = router;