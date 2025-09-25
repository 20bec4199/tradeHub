// server/models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order',
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  paymentGateway: { 
    type: String, 
    required: true,
    enum: ['razorpay', 'stripe', 'payu', 'cash_on_delivery'] 
  },
  paymentMethod: { 
    type: String, 
    required: true,
    enum: [
      'credit_card', 'debit_card', 'upi', 'netbanking', 
      'wallet', 'emi', 'cash_on_delivery', 'cardless_emi'
    ] 
  },
  paymentDetails: {
    // Generic payment details that work for all gateways
    gatewayPaymentId: String,
    gatewayOrderId: String,
    bankReferenceNumber: String,
    upiTransactionId: String,
    cardLast4: String,
    cardNetwork: { type: String, enum: ['visa', 'mastercard', 'rupay', 'amex'] },
    cardType: { type: String, enum: ['credit', 'debit'] },
    bankName: String,
    walletName: String,
    upiId: String
  },
  amount: {
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    shipping: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: 'INR' }
  },
  status: { 
    type: String, 
    required: true,
    enum: [
      'created',       // Payment initiated
      'authorized',    // Payment authorized but not captured
      'captured',      // Payment successfully captured
      'failed',        // Payment failed
      'refunded',      // Payment refunded
      'partially_refunded',
      'cancelled'      // Payment cancelled
    ],
    default: 'created' 
  },
  refunds: [{
    amount: { type: Number, required: true },
    reason: String,
    gatewayRefundId: String,
    status: { 
      type: String, 
      enum: ['pending', 'processed', 'failed'],
      default: 'pending' 
    },
    processedAt: Date,
    createdAt: { type: Date, default: Date.now }
  }],
  gatewayResponse: mongoose.Schema.Types.Mixed, // Raw response from payment gateway
  errorDetails: {
    code: String,
    description: String,
    gatewayErrorCode: String,
    step: String // Where the error occurred
  },
  attempts: { type: Number, default: 1 },
  maxAttempts: { type: Number, default: 3 },
  nextRetryAt: Date,
  metadata: mongoose.Schema.Types.Mixed, // Additional data for specific payment methods
  webhookEvents: [{
    eventType: String,
    gatewayEventId: String,
    payload: mongoose.Schema.Types.Mixed,
    receivedAt: { type: Date, default: Date.now },
    processed: { type: Boolean, default: false }
  }]
}, { 
  timestamps: true 
});

// Indexes for better performance
paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ 'paymentDetails.gatewayPaymentId': 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ nextRetryAt: 1 });

// Virtual for total refunded amount
paymentSchema.virtual('totalRefunded').get(function() {
  return this.refunds
    .filter(refund => refund.status === 'processed')
    .reduce((total, refund) => total + refund.amount, 0);
});

// Virtual for refundable amount
paymentSchema.virtual('refundableAmount').get(function() {
  if (this.status !== 'captured') return 0;
  return this.amount.total - this.totalRefunded;
});

module.exports = mongoose.model('Payment', paymentSchema);