class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode || 500;
    Error.captureStackTrace(this, this.constructor);
  }
}

// wrapper to catch async errors
const asyncError = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// global error handler
const globalErrorHandler = (err, req, res, next) => {
  console.error("Error:", err); // good for debugging

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: "Error",
      message: err.message,
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "Error",
      message: "Validation Error",
    });
  }

  if (err.name === "NotFoundError") {
    return res.status(404).json({
      status: "Error",
      message: "Invalid route: " + req.url,
    });
  }

  // default fallback

  return res.status(500).json({
    status: "Error",
    message: "An unexpected error occurred",
  });
};

module.exports = { ApiError, asyncError, globalErrorHandler };
