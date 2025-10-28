import express from 'express';
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getCart
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * User Routes (Wishlist & Cart)
 */

// All routes require authentication
router.post('/wishlist/:productId', authenticate, addToWishlist);
router.delete('/wishlist/:productId', authenticate, removeFromWishlist);
router.get('/wishlist', authenticate, getWishlist);
router.get('/cart', authenticate, getCart);

export default router;
