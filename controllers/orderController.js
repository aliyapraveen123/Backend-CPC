import Order from '../models/Order.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ErrorHandler } from '../middleware/error.js';

/**
 * Create new order
 * POST /api/orders
 */
export const createOrder = asyncHandler(async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalAmount
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return next(new ErrorHandler('No order items provided', 400));
  }

  // Verify stock availability
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      return next(new ErrorHandler(`Product not found: ${item.name}`, 404));
    }
    if (product.stock < item.quantity) {
      return next(new ErrorHandler(`Insufficient stock for ${product.name}`, 400));
    }
  }

  // Create order
  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalAmount
  });

  // Update product stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity }
    });
  }

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    order
  });
});

/**
 * Get user's orders
 * GET /api/orders/my-orders
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort('-createdAt')
    .populate('orderItems.product', 'name images');

  res.status(200).json({
    success: true,
    orders
  });
});

/**
 * Get single order by ID
 * GET /api/orders/:id
 */
export const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name images');

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  // Check if order belongs to user (unless admin)
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorHandler('Not authorized to view this order', 403));
  }

  res.status(200).json({
    success: true,
    order
  });
});

/**
 * Update order status (Admin only)
 * PUT /api/orders/:id/status
 */
export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  if (order.orderStatus === 'Delivered') {
    return next(new ErrorHandler('This order has already been delivered', 400));
  }

  order.orderStatus = status;

  if (status === 'Delivered') {
    order.deliveredAt = Date.now();
    order.paymentInfo.status = 'Completed';
    order.paymentInfo.paidAt = Date.now();
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    order
  });
});

/**
 * Cancel order
 * PUT /api/orders/:id/cancel
 */
export const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  // Check if order belongs to user
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorHandler('Not authorized to cancel this order', 403));
  }

  if (order.orderStatus === 'Delivered') {
    return next(new ErrorHandler('Cannot cancel delivered order', 400));
  }

  if (order.orderStatus === 'Shipped') {
    return next(new ErrorHandler('Cannot cancel shipped order', 400));
  }

  // Restore product stock
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity }
    });
  }

  order.orderStatus = 'Cancelled';
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    order
  });
});

/**
 * Get all orders (Admin only)
 * GET /api/orders/admin/all
 */
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .sort('-createdAt')
    .populate('user', 'name email')
    .populate('orderItems.product', 'name');

  const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  res.status(200).json({
    success: true,
    orders,
    totalOrders: orders.length,
    totalAmount
  });
});
