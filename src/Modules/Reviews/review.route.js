import { Router } from "express";
const reviewRouter = Router();
import * as schema from "./review.schema.js";
//controller
import * as orderController from "./review.controller.js";
//middleware
import * as middleware from "../../Middlewares/index.js";
const { authenticate, authorization, errorHandler, validationMiddleware } =
  middleware;
// utils
import { systemRoles } from "../../utils/index.js";
const { ADMIN } = systemRoles;

// add review Router
reviewRouter.post(
  "/add/:productId",
  errorHandler(validationMiddleware(schema.addReviewSchema)),
  errorHandler(authenticate()),
  errorHandler(orderController.addReview)
);

// list review Router
reviewRouter.get(
  "/",
  errorHandler(authenticate()),
  errorHandler(orderController.listReviews)
);

// Changing review status Router
reviewRouter.put(
  "/approve-reject/:reviewId",
  errorHandler(validationMiddleware(schema.reviewStatusChangingSchema)),
  errorHandler(authenticate()),
  errorHandler(authorization(ADMIN)),
  errorHandler(orderController.reviewStatusChanging)
);

export { reviewRouter };
