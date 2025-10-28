import mongoose from 'mongoose';

/**
 * Review Schema - Embedded in Product
 * Stores user reviews and ratings for products
 */
const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxLength: [500, 'Review cannot exceed 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Product Schema - Manages product catalog
 * Includes stock management, categories, and reviews
 */
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true,
    maxLength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please enter product description'],
    maxLength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String
  }],
  category: {
    type: String,
    required: [true, 'Please select product category'],
    enum: [
      'Electronics',
      'Computers',
      'Smartphones',
      'Fashion',
      'Home & Kitchen',
      'Books',
      'Sports',
      'Beauty',
      'Toys',
      'Automotive',
      'Other'
    ]
  },
  stock: {
    type: Number,
    required: [true, 'Please enter product stock'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  brand: {
    type: String,
    default: ''
  },
  specifications: {
    type: Map,
    of: String,
    default: {}
  },
  reviews: [reviewSchema],
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate average rating when reviews change
productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.ratings = 0;
    this.numReviews = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.ratings = (totalRating / this.reviews.length).toFixed(1);
    this.numReviews = this.reviews.length;
  }
};

// Add index for search optimization
productSchema.index({ name: 'text', description: 'text', category: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ ratings: -1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
