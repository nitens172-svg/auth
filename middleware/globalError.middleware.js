const globalErrorHandler = (err, req, res, next) => {
    err.stack = err.stack || "No stack trace available";
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success:false,
        error: message,
        stack: err.stack
    });
};

export default globalErrorHandler;