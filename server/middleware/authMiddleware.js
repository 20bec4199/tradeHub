const jwt = require('jsonwebtoken');
const ErrorHandler = require('./errorHandler');
const catchAsyncError = require('./catchAsyncError');
const User = require('../models/User');

exports.authMiddleware = catchAsyncError(async (req, res, next) => {
    let token;

    if(req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }
    else if (
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new ErrorHandler('Not authorized to access this route', 401));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
       if (!decoded) {
        return next(new ErrorHandler('Not authorized to access this route', 401));
       }
       const useCheck = await User.findById(decoded.id);
         if (!useCheck) {
          return next(new ErrorHandler('No user found with this id', 404));
         }
         req.user = useCheck;
         next();
    }  catch (err) {
        return next(new ErrorHandler('Not authorized to access this route', 401));
    }
});