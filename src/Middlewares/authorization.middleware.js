import { ErrorClassHandler } from "../utils/index.js";

export const authorization = (allowedRoles) => {
  return async (req, res, next) => {
    // loggedIn role
    const user = req.authUser;
    if (!allowedRoles.includes(user.userType)) {
      return next(new ErrorClassHandler("You are not authorized"), 401);
    }
    next();
  };
};
