// middlewares/errorHandler.js
const errorHandler = function (err, req, res, next) {

  // Mongoose validation error
  if (err?.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.json({
      status: false,
      message: 'Data validation error',
      errors: process.env.NODE_ENV === 'development' ? messages : {}
    });
    // return res.status(400).json({
    //   status: false,
    //   message: 'Data validation error',
    //   errors: messages
    // });
  }

  // Duplicate key error (e.g., unique fields)
  if (err?.code === 11000) {
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'Unknown field';
    return res.json({
      status: false,
      message: `${field.replace('_', ' ')} already exists`,
      errors: process.env.NODE_ENV === 'development' ? 'Duplicate Value' : {}
    });
    // return res.status(400).json({
    //   status: false,
    //   message: `${field} already exists`,
    //   errors: 'Duplicate Value'
    // });
  }

  // MongoDB JSON Schema validation error (code 121)
  if (err?.name === 'MongoServerError' && err?.code === 121) {
    return res.json({
      status: false,
      message: 'MongoDB Schema validation error',
      errors: process.env.NODE_ENV === 'development' ? (err.errInfo?.details?.schemaRulesNotSatisfied || err.message) : {}
    });
    // return res.status(400).json({
    //   status: false,
    //   message: 'MongoDB Schema validation error',
    //   errors: err.errInfo?.details?.schemaRulesNotSatisfied || err.message
    // });
  }

  // Multer errors (e.g. file size, file filter errors)
  if (err?.name === 'MulterError' || err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(200).json({
      status: false,
      message: err.message || 'File upload error',
      error_message: err.message || 'File upload error',
      errors: process.env.NODE_ENV === 'development' ? err : {}
    });
  }

  res.status(200).json({ 
    status: false, 
    message: err.message || 'something went wrong !!', 
    error_message: err.message || 'Internal Server Error',
    errors: process.env.NODE_ENV === 'development' ? err : {}
  });

};


module.exports = errorHandler;