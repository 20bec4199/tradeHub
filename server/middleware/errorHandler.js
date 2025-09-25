class ErrorHandler extends Error {
    constructor(message, statusCode, flag) {
        super(message);
        this.statusCode = statusCode;
        this.flag = flag;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorHandler;