// server/models/Brand.js
const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true 
  },
  slug: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true 
  },
  description: { type: String },
  logo: { type: String },
  website: { type: String },
  isActive: { type: Boolean, default: true },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Brand', brandSchema);