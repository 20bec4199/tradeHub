const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../utils/catchAsyncError');
const User = require('../models/User');

exports.authMiddleware = catchAsyncError(async (req, res, next) => {
    let token;

    if(req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }