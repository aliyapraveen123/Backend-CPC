import express from 'express';
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  addProductReview,
  getCategories,
  getRelatedProducts
} from '../controllers/productController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * Product Routes
 */

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);
router.get('/:id/related', getRelatedProducts);

// Protected routes (require authentication)
router.post('/:id/reviews', authenticate, addProductReview);

export default router;
