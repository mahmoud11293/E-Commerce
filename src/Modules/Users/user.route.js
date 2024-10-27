import { Router } from "express";
const userRouter = Router();
import * as schema from "./user.schema.js";
//controller
import * as userController from "./user.controller.js";
//middleware
import * as middlewares from "../../Middlewares/index.js";
const { errorHandler, authenticate, validationMiddleware } = middlewares;

// add user Router
userRouter.post(
  "/register",
  errorHandler(validationMiddleware(schema.signUpSchema)),
  errorHandler(userController.signUp)
);

// verify Email Router
userRouter.get(
  "/verify-email/:token",
  errorHandler(userController.verifyEmail)
);

// login Router
userRouter.post(
  "/login",
  errorHandler(validationMiddleware(schema.loginSchema)),
  errorHandler(userController.login)
);

// Signup with google Router
userRouter.post(
  "/signUpWithGmail",
  errorHandler(userController.signUpWithGmail)
);

// Login wih google Router
userRouter.post("/loginWithGmail", errorHandler(userController.loginWithGmail));

// get user Router
userRouter.get(
  "/profile",
  errorHandler(authenticate()),
  errorHandler(validationMiddleware(schema.getProfileSchema)),
  errorHandler(userController.getProfile)
);

// Update user Router
userRouter.put(
  "/update",
  errorHandler(authenticate()),
  errorHandler(validationMiddleware(schema.updateUserSchema)),
  errorHandler(userController.updateUser)
);

// Update password Router
userRouter.put(
  "/update-password",
  errorHandler(authenticate()),
  errorHandler(validationMiddleware(schema.updatePasswordSchema)),
  errorHandler(userController.updatePassword)
);

// Forget password Router
userRouter.post(
  "/forget-password",
  errorHandler(validationMiddleware(schema.forgetPasswordSchema)),
  errorHandler(userController.forgetPassword)
);

// Reset password Router
userRouter.patch(
  "/reset-password",
  errorHandler(validationMiddleware(schema.resetPasswordSchema)),
  errorHandler(userController.resetPassword)
);

// delete user Router
userRouter.delete(
  "/delete",
  errorHandler(authenticate()),
  errorHandler(validationMiddleware(schema.deleteUserSchema)),
  errorHandler(userController.deleteUser)
);

export { userRouter };
