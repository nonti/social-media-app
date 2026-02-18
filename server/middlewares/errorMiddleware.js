// UNSUPPORTED ENDPOINTS

const notFound = (req, res, next) => { 
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

// ERROR MIDDLEWARE
const errorHandler = (err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }

  res.status(err.code || 500).json({ message: err.message || 'Internal Server Error' });
}

export { notFound, errorHandler }