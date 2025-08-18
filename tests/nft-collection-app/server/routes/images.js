const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const uploadsDir = path.join(__dirname, '../../uploads/images');

// Route for uploading images
router.post('/upload', (req, res) => {
    const file = req.files.image; // Assuming you're using a middleware like express-fileupload
    const uploadPath = path.join(uploadsDir, file.name);

    file.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json({ message: 'Image uploaded successfully', fileName: file.name });
    });
});

// Route for retrieving images
router.get('/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(uploadsDir, imageName);

    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.sendFile(imagePath);
    });
});

module.exports = router;