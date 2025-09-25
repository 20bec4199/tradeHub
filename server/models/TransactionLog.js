// server/models/TransactionLog.js
const mongoose = require('mongoose');

const transactionLogSchema = new mongoose.Schema({
  payment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Payment',
    required: true 
  },
  action: { 
    type: String, 
    required: true,
    enum: [
      'payment_initiated',
      'payment_authorized',
      'payment_captured',
      'payment_failed',
      'refund_initiated',
      'refund_processed',
      'refund_failed',
      'webhook_received',
      'retry_attempt'
    ] 
  },
  status: { 
    type: String, 
    enum: ['success', 'failure', 'pending'],
    required: true 
  },
  requestData: mongoose.Schema.Types.Mixed,
  responseData: mongoose.Schema.Types.Mixed,
  gateway: String,
  ipAddress: String,
  userAgent: String,
  error: {
    code: String,
    message: String,
    details: mongoose.Schema.Types.Mixed
  },
  performedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  } // For admin actions
}, { 
  timestamps: true 
});

transactionLogSchema.index({ payment: 1, createdAt: 1 });
transactionLogSchema.index({ action: 1 });

module.exports = mongoose.model('TransactionLog', transactionLogSchema);