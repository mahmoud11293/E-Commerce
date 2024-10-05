export class ErrorClassHandler {
  constructor(message, statusCode, stack, name) {
    this.message = message;
    this.statusCode = statusCode;
    this.stack = stack ? stack : null;
    this.name = name ? name : "Error";
  }
}
