const sharp = require('sharp');

const imageProcessor = {
  resizeImage: async (buffer, width, height) => {
    try {
      const resizedImage = await sharp(buffer)
        .resize(width, height, { fit: 'inside', withoutEnlargement: true })
        .toBuffer();
      return resizedImage;
    } catch (error) {
      throw new Error('Error resizing image: ' + error.message);
    }
  },

  optimizeImage: async (buffer, quality = 90) => {
    try {
      const optimizedImage = await sharp(buffer)
        .jpeg({ quality })
        .toBuffer();
      return optimizedImage;
    } catch (error) {
      throw new Error('Error optimizing image: ' + error.message);
    }
  }
};

module.exports = imageProcessor;