// server/models/Coupon.js
const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true,
    unique: true,
    uppercase: true 
  },
  description: { type: String },
  type: { 
    type: String, 
    enum: ['percentage', 'fixed'],
    required: true 
  },
  value: { type: Number, required: true },
  minimumAmount: { type: Number, default: 0 },
  maximumDiscount: { type: Number },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  usageLimit: { type: Number }, // Total usage limit
  usedCount: { type: Number, default: 0 },
  userLimit: { type: Number, default: 1 }, // Usage limit per user
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  excludedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  isActive: { type: Boolean, default: true }
}, { 
  timestamps: true 
});

// Index for active coupons
couponSchema.index({ code: 1, isActive: 1 });
couponSchema.index({ validUntil: 1 });

module.exports = mongoose.model('Coupon', couponSchema);