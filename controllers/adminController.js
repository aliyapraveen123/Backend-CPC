import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ErrorHandler } from '../middleware/error.js';

/**
 * Create new product (Admin only)
 * POST /api/admin/products
 */
export const createProduct = asyncHandler(async (req, res) => {
  const productData = {
    ...req.body,
    createdBy: req.user._id
  };

  // Handle image upload
  if (req.files && req.files.length > 0) {
    productData.images = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      alt: req.body.name
    }));
  }

  const product = await Product.create(productData);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    product
  });
});

/**
 * Update product (Admin only)
 * PUT /api/admin/products/:id
 */
export const updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  // Handle new image uploads
  if (req.files && req.files.length > 0) {
    req.body.images = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      alt: req.body.name || product.name
    }));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    product
  });
});

/**
 * Delete product (Admin only)
 * DELETE /api/admin/products/:id
 */
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

/**
 * Get all users (Admin only)
 * GET /api/admin/users
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');

  res.status(200).json({
    success: true,
    users,
    totalUsers: users.length
  });
});

/**
 * Update user role (Admin only)
 * PUT /api/admin/users/:id/role
 */
export const updateUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'User role updated successfully',
    user
  });
});

/**
 * Delete user (Admin only)
 * DELETE /api/admin/users/:id
 */
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

/**
 * Get dashboard analytics (Admin only)
 * GET /api/admin/analytics
 */
export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  // Total users
  const totalUsers = await User.countDocuments();
  
  // Total products
  const totalProducts = await Product.countDocuments();
  
  // Total orders
  const totalOrders = await Order.countDocuments();
  
  // Total revenue
  const orders = await Order.find({ orderStatus: 'Delivered' });
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  
  // Recent orders
  const recentOrders = await Order.find()
    .sort('-createdAt')
    .limit(5)
    .populate('user', 'name email');
  
  // Orders by status
  const ordersByStatus = await Order.aggregate([
    {
      $group: {
        _id: '$orderStatus',
        count: { $sum: 1 }
      }
    }
  ]);

  // Revenue by month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const revenueByMonth = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
        orderStatus: 'Delivered'
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);

  // Top selling products
  const topProducts = await Order.aggregate([
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.product',
        totalSold: { $sum: '$orderItems.quantity' },
        revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' }
  ]);

  res.status(200).json({
    success: true,
    analytics: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      ordersByStatus,
      revenueByMonth,
      topProducts
    }
  });
});

/**
 * Update inventory/stock (Admin only)
 * PUT /api/admin/products/:id/stock
 */
export const updateStock = asyncHandler(async (req, res, next) => {
  const { stock } = req.body;

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { stock },
    { new: true, runValidators: true }
  );

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Stock updated successfully',
    product
  });
});
