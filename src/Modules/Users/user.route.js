import { Router } from "express";
const userRouter = Router();
//controller
import * as userController from "./user.controller.js";
//middleware
import * as middlewares from "../../Middlewares/index.js";
const { errorHandler, authenticate } = middlewares;

// add user Router
userRouter.post("/register", errorHandler(userController.signUp));

// verify Email Router
userRouter.get(
  "/verify-email/:token",
  errorHandler(userController.verifyEmail)
);

// login Router
userRouter.post("/login", errorHandler(userController.login));

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
  errorHandler(userController.getProfile)
);

// Update user Router
userRouter.put(
  "/update",
  errorHandler(authenticate()),
  errorHandler(userController.updateUser)
);

// Update password Router
userRouter.put(
  "/update-password",
  errorHandler(authenticate()),
  errorHandler(userController.updatePassword)
);

// Forget password Router
userRouter.post(
  "/forget-password",
  errorHandler(userController.forgetPassword)
);

// Reset password Router
userRouter.patch("/reset-password", errorHandler(userController.resetPassword));

// delete user Router
userRouter.delete(
  "/delete",
  errorHandler(authenticate()),
  errorHandler(userController.deleteUser)
);

export { userRouter };
