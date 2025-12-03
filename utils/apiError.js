// backend/utils/apiError.js

class AppError extends Error {
    constructor(message, httpStatus = 500, code = null) {
      super(message);
      this.status = httpStatus;
      this.code = code || httpStatus;
    }
  }
  
  function sendApiError(res, httpStatus, message, code) {
    return res.status(httpStatus).json({
      success: false,
      error: message,
      code: code || httpStatus,
    });
  }
  
  module.exports = {
    AppError,
    sendApiError,
  };
  