// server/models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',
    required: true 
  },
  order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order',
    required: true 
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5 
  },
  title: { type: String },
  comment: { type: String },
  images: [String],
  isVerified: { type: Boolean, default: false }, // Verified purchase
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: true },
  helpful: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { 
  timestamps: true 
});

// Compound index to ensure one review per product per user
reviewSchema.index({ user: 1, product: 1 }, { unique: true });
reviewSchema.index({ product: 1, rating: 1 });
reviewSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);