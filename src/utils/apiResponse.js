// Unified API response format
class APIResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

// Helper function to send response
const sendResponse = (res, statusCode, data, message = "Success") => {
  const response = new APIResponse(statusCode, data, message);
  return res.status(statusCode).json(response);
};

module.exports = { APIResponse, sendResponse };
