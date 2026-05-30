const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  console.error("Error:", err);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};


const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
    hint: "Use /api/v1/... — e.g. POST /api/v1/auth/login, GET /api/v1/profiles/workers. Docs: /api-docs",
  });
};

module.exports = { errorHandler, notFound };
