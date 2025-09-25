module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    console.log(err);
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            stack: err.stack,
            error: err,
            flag: err.flag,
        })
    }

    if (process.env.NODE_ENV === 'production') {
        let message = err.message;
        let error = new Error(message);

        if (err.name === 'ValidationError') {
            let message = Object.values(err.errors).map(value => value.message)
            error = new Error(message);
            err.statusCode = 400
        }

        if (err.name === 'castError') {
            let message = `Resource not found: ${err.path}`
            error = new Error(message);
            err.statusCode = 400;
        }

        if (err.code == 11000) {
            let message = `Duplicate ${Object.keys(err.keyValue)} error`;
            error = new Error(message);
            err.statusCode = 400;
        }

        res.status(err.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error',
            flag: err.flag
        })

    }
}