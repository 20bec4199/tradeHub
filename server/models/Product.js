// server/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  shortDescription: { type: String },
  sku: { 
    type: String, 
    unique: true,
    required: true 
  },
  price: {
    current: { type: Number, required: true },
    original: { type: Number },
    currency: { type: String, default: 'INR' }
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    required: true 
  },
  subcategory: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category' 
  },
  brand: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Brand' 
  },
  vendor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  images: [{
    url: String,
    altText: String,
    isPrimary: { type: Boolean, default: false }
  }],
  attributes: [{
    name: String,
    value: String
  }],
  variants: [{
    size: String,
    color: String,
    stock: { type: Number, default: 0 },
    price: Number,
    sku: String
  }],
  stock: { 
    type: Number, 
    required: true,
    default: 0 
  },
  dimensions: {
    weight: Number,
    length: Number,
    width: Number,
    height: Number
  },
  shipping: {
    weight: Number,
    dimensions: String,
    freeShipping: { type: Boolean, default: false }
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  tags: [String],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  }
}, { 
  timestamps: true 
});

// Indexes for better performance
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ vendor: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ tags: 1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.price.original && this.price.original > this.price.current) {
    return Math.round(((this.price.original - this.price.current) / this.price.original) * 100);
  }
  return 0;
});

module.exports = mongoose.model('Product', productSchema);