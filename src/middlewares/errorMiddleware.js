const errorMiddleware = (error, req, res, next) => {
  console.error(error.stack);

  // Check if the error is a known mongoose error (Database-related)
  if (error.code && error.meta && error.meta.target) {
    res.status(400).json({ status: false, message: error.message }); // Bad request
  } else {
    res.status(500).json({ status: false, message: error.message || "Internal Server Error" }); // Internal server error
  }
};

module.exports = errorMiddleware;
