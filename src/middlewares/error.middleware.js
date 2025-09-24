// Global error handler
const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: err.message || 'Something went wrong',
    // show stack trace only in development for security
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = globalErrorHandler;
