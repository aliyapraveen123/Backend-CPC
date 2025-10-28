/**
 * Custom Error Handler Class
 * Extends Error class for better error management
 */
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global Error Handling Middleware
 * Catches all errors and formats response
 */
const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Development vs Production error response
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err,
      stack: err.stack
    });
  } else {
    // Production error response
    let error = { ...err };
    error.message = err.message;

    // Mongoose bad ObjectId error
    if (err.name === 'CastError') {
      const message = `Resource not found. Invalid: ${err.path}`;
      error = new ErrorHandler(message, 400);
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      const message = `${field} already exists`;
      error = new ErrorHandler(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors)
        .map(value => value.message)
        .join(', ');
      error = new ErrorHandler(message, 400);
    }

    // JWT error
    if (err.name === 'JsonWebTokenError') {
      const message = 'Invalid token. Please login again.';
      error = new ErrorHandler(message, 401);
    }

    // JWT expired error
    if (err.name === 'TokenExpiredError') {
      const message = 'Token expired. Please login again.';
      error = new ErrorHandler(message, 401);
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

export default errorMiddleware;
export { ErrorHandler };
