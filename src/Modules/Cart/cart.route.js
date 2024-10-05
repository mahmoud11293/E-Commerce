import { Router } from "express";
const cartRouter = Router();
//controller
import * as cartController from "./cart.controller.js";
//middleware
import * as middleware from "../../Middlewares/index.js";
const { authenticate, errorHandler } = middleware;

// add cart Router
cartRouter.post(
  "/add/:productId",
  authenticate(),
  errorHandler(cartController.addCart)
);

// remove product from cart Router
cartRouter.put(
  "/remove/:productId",
  authenticate(),
  errorHandler(cartController.removeFromCart)
);

// update cart Router
cartRouter.put(
  "/update/:productId",
  authenticate(),
  errorHandler(cartController.updateCart)
);

// get cart Router
cartRouter.get("/", authenticate(), errorHandler(cartController.getCart));

export { cartRouter };
