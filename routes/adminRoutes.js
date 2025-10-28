import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getDashboardAnalytics,
  updateStock
} from '../controllers/adminController.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

/**
 * Admin Routes (require admin authentication)
 */

// All routes require admin authentication
router.use(authenticate, authorizeAdmin);

// Product management
router.post('/products', upload.array('images', 5), createProduct);
router.put('/products/:id', upload.array('images', 5), updateProduct);
router.delete('/products/:id', deleteProduct);
router.put('/products/:id/stock', updateStock);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Analytics
router.get('/analytics', getDashboardAnalytics);

export default router;
