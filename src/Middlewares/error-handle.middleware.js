import { ErrorClassHandler } from "../utils/error-class.utils.js";

export const errorHandler = (API) => {
  return (req, res, next) => {
    API(req, res, next)?.catch((err) => {
      next(new ErrorClassHandler("Internal Server error", 500, err?.message));
    });
  };
};

export const globalResponse = (err, req, res, next) => {
  if (err) {
    res.status(err["statusCode"] || 500).json({
      message: "Internal server error",
      name: err.name,
      error: err.message,
      status: err.statusCode,
      stack: err.stack,
    });
  }
};
