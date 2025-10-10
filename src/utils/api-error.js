class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went worng",
    errors = [],
    stack = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    }
  }
}

export { ApiError };
