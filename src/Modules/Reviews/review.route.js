import { Router } from "express";
const reviewRouter = Router();
//controller
import * as orderController from "./review.controller.js";
//middleware
import * as middleware from "../../Middlewares/index.js";
const { authenticate, errorHandler } = middleware;

// add review Router
reviewRouter.post(
  "/add/:productId",
  authenticate(),
  errorHandler(orderController.addReview)
);

// list review Router
reviewRouter.get(
  "/",
  authenticate(),
  errorHandler(orderController.listReviews)
);

// Changing review status Router
reviewRouter.put(
  "/approve-reject/:reviewId",
  authenticate(), // Admin Authorized
  errorHandler(orderController.reviewStatusChanging)
);

export { reviewRouter };
