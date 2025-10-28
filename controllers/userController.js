import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ErrorHandler } from '../middleware/error.js';

/**
 * Add product to wishlist
 * POST /api/users/wishlist/:productId
 */
export const addToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;

  if (user.wishlist.includes(productId)) {
    return next(new ErrorHandler('Product already in wishlist', 400));
  }

  await user.addToWishlist(productId);

  const updatedUser = await User.findById(req.user._id).populate('wishlist');

  res.status(200).json({
    success: true,
    message: 'Product added to wishlist',
    wishlist: updatedUser.wishlist
  });
});

/**
 * Remove product from wishlist
 * DELETE /api/users/wishlist/:productId
 */
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;

  await user.removeFromWishlist(productId);

  const updatedUser = await User.findById(req.user._id).populate('wishlist');

  res.status(200).json({
    success: true,
    message: 'Product removed from wishlist',
    wishlist: updatedUser.wishlist
  });
});

/**
 * Get user's wishlist
 * GET /api/users/wishlist
 */
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');

  res.status(200).json({
    success: true,
    wishlist: user.wishlist
  });
});

/**
 * Get user's cart from local storage (client-side)
 * This is a placeholder - cart is typically managed on frontend
 */
export const getCart = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cart is managed on client-side'
  });
});
