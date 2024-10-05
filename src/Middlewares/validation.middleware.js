import { ErrorClassHandler } from "../utils/index.js";

const reqKeys = ["body", "params", "query", "headers", "authUser"];

export const validationMiddleware = (schema) => {
  return (req, res, next) => {
    let validationErrors = [];
    for (const key of reqKeys) {
      const validationResult = schema[key]?.validate(req[key], {
        abortEarly: false,
      });
      if (validationResult?.error) {
        validationErrors.push(validationResult.error.details);
      }
    }
    validationErrors.length
      ? next(new ErrorClassHandler("Validation Error", 400, validationErrors))
      : next();
  };
};
