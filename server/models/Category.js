// server/models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  slug: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true 
  },
  description: { type: String },
  parent: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    default: null 
  },
  image: { type: String },
  isActive: { type: Boolean, default: true },
  attributes: [{
    name: String,
    values: [String],
    isRequired: { type: Boolean, default: false }
  }],
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  order: { type: Number, default: 0 }
}, { 
  timestamps: true 
});

// Indexes
categorySchema.index({ parent: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ order: 1 });

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

module.exports = mongoose.model('Category', categorySchema);