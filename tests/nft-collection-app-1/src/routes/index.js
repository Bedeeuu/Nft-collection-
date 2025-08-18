import express from 'express';
import uploadRoutes from './upload.js';
import analyzeRoutes from './analyze.js';
import collectionRoutes from './collection.js';

const router = express.Router();

export default (app) => {
  app.use('/api/upload', uploadRoutes);
  app.use('/api/analyze', analyzeRoutes);
  app.use('/api/collection', collectionRoutes);
};