import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ErrorHandler } from '../middleware/error.js';

/**
 * Get all products with search, filter, and pagination
 * GET /api/products
 */
export const getProducts = asyncHandler(async (req, res) => {
  const { 
    keyword, 
    category, 
    minPrice, 
    maxPrice, 
    rating,
    deals,
    page = 1, 
    limit = 50,
    sort = '-createdAt'
  } = req.query;

  // Build query
  const query = { isActive: true };

  // Search by keyword (name or description)
  if (keyword) {
    query.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } }
    ];
  }

  // Filter by category
  if (category && category !== 'All') {
    query.category = category;
  }

  // Filter by deals (products with discounts)
  if (deals === 'true') {
    query.discountPrice = { $exists: true, $ne: null };
  }

  // Filter by price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Filter by rating
  if (rating) {
    query.ratings = { $gte: Number(rating) };
  }

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);

  // Execute query
  const products = await Product.find(query)
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  const totalProducts = await Product.countDocuments(query);

  res.status(200).json({
    success: true,
    products,
    totalProducts,
    totalPages: Math.ceil(totalProducts / Number(limit)),
    currentPage: Number(page)
  });
});

/**
 * Get single product by ID
 * GET /api/products/:id
 */
export const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('reviews.user', 'name avatar');

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  res.status(200).json({
    success: true,
    product
  });
});

/**
 * Get featured products
 * GET /api/products/featured
 */
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true })
    .limit(8)
    .sort('-ratings');

  res.status(200).json({
    success: true,
    products
  });
});

/**
 * Add product review
 * POST /api/products/:id/reviews
 */
export const addProductReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  // Check if user already reviewed
  const alreadyReviewed = product.reviews.find(
    review => review.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    return next(new ErrorHandler('You have already reviewed this product', 400));
  }

  // Add review
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  };

  product.reviews.push(review);
  product.calculateAverageRating();

  await product.save();

  res.status(201).json({
    success: true,
    message: 'Review added successfully',
    product
  });
});

/**
 * Get product categories
 * GET /api/products/categories
 */
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');

  res.status(200).json({
    success: true,
    categories
  });
});

/**
 * Get related products
 * GET /api/products/:id/related
 */
export const getRelatedProducts = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true
  })
    .limit(4)
    .sort('-ratings');

  res.status(200).json({
    success: true,
    products: relatedProducts
  });
});
