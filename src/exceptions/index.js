class ClientError extends Error {
    constructor(message, statusCode = 400) {
      super(message);
      this.statusCode = statusCode;
      this.name = 'ClientError';
    }
  }
  
  class InvariantError extends ClientError {
    constructor(message) {
      super(message);
      this.statusCode = 400;
      this.name = 'InvariantError';
    }
  }
  
  class AuthenticationError extends ClientError {
    constructor(message) {
      super(message, 401);
      this.name = 'AuthenticationError';
    }
  }
  
  module.exports = { ClientError, InvariantError, AuthenticationError };