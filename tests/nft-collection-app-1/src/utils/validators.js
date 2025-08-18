const { body, validationResult } = require('express-validator');

const validateImageUpload = [
  body('customName')
    .optional()
    .isString()
    .withMessage('Custom name must be a string')
    .isLength({ max: 50 })
    .withMessage('Custom name must not exceed 50 characters'),
  
  body('generateIPFS')
    .optional()
    .isBoolean()
    .withMessage('Generate IPFS must be a boolean value')
];

const validateAnalyzeRequest = [
  body('imageUrl')
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  
  body('question')
    .isString()
    .withMessage('Question must be a string')
    .isLength({ min: 1 })
    .withMessage('Question must not be empty')
];

const validateCollectionRequest = [
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100')
];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateImageUpload,
  validateAnalyzeRequest,
  validateCollectionRequest,
  validateRequest
};