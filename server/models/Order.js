// server/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { 
    type: String, 
    unique: true,
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  items: [{
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product',
      required: true 
    },
    variant: {
      size: String,
      color: String
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: {
    amount: { type: Number, default: 0 },
    code: String,
    type: { type: String, enum: ['percentage', 'fixed'] }
  },
  total: { type: Number, required: true },
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  billingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  payment: {
    method: { 
      type: String, 
      enum: ['credit_card', 'debit_card', 'upi', 'netbanking', 'cod'],
      required: true 
    },
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending' 
    },
    transactionId: String,
    paymentGateway: String
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending' 
  },
  shipping: {
    carrier: String,
    trackingNumber: String,
    estimatedDelivery: Date
  },
  notes: String
}, { 
  timestamps: true 
});

// Indexes for better performance
orderSchema.index({ user: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'payment.status': 1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD${Date.now()}${count.toString().padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);