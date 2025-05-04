class CustomAPIError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500; // Default status code
  }
}

module.exports = CustomAPIError; 