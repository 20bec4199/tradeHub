// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    select: false // Don't include password in queries by default
  },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    default: 'local'
  },
  providerId: { type: String },
  avatar: { type: String },
  role: {
    type: String,
    enum: ['customer', 'vendor', 'admin'],
    default: 'customer'
  },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  addresses: [{
    type: {
      name: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'India' },
      phone: String,
      isDefault: { type: Boolean, default: false }
    }
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: { type: Number, default: 1 },
    size: String,
    color: String
  }],
  preferences: {
    currency: { type: String, default: 'INR' },
    language: { type: String, default: 'en' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    }
  },
  refreshToken: {
    type: String,
    select: false
  },
  refreshTokenExpires: {
    type: Date,
    select: false
  },
  resetPasswordToken: {
    type: String,
    select: false
  },
  resetPasswordTokenExpires: {
    type: Date,
    select: false
  }
}, {
  collection: 'user', timestamps: true, versionKey: false
});

// Indexes for better query performance
// userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: 1 });

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const bcrypt = require('bcrypt');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
})

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
}

userSchema.methods.setRefreshToken = async function (token) {
  const salt = await bcrypt.genSalt(10);
  this.refreshToken = await bcrypt.hash(token, salt);
  this.refreshTokenExpires = Date.now() + 24*60*60*1000; // 1 day
  await this.save();
}

userSchema.methods.setResetPasswordToken = async function (token) {
  const salt = await bcrypt.genSalt(10);
  this.resetPasswordToken = await bcrypt.hash(token, salt);
  this.resetPasswordTokenExpires = Date.now() + 60*60*1000; // 1 hour
  await this.save();
}

userSchema.methods.isValidRefreshToken = async function (token) {
  if (this.refreshTokenExpires < Date.now()) return false;
  return await bcrypt.compare(token, this.refreshToken);
}
userSchema.methods.isValidResetPasswordToken = async function (token) {
  if (this.resetPasswordTokenExpires < Date.now()) return false;
  return await bcrypt.compare(token, this.resetPasswordToken);
}

module.exports = mongoose.model('User', userSchema);