import { Router } from "express";
const cartRouter = Router();
import * as schema from "./cart.schema.js";
//controller
import * as cartController from "./cart.controller.js";
//middleware
import * as middleware from "../../Middlewares/index.js";
const { authenticate, errorHandler, validationMiddleware } = middleware;

// add cart Router
cartRouter.post(
  "/add/:productId",
  errorHandler(authenticate()),
  errorHandler(validationMiddleware(schema.addCartSchema)),
  errorHandler(cartController.addCart)
);

// remove product from cart Router
cartRouter.put(
  "/remove/:productId",
  errorHandler(authenticate()),
  errorHandler(validationMiddleware(schema.removeFromCart)),
  errorHandler(cartController.removeFromCart)
);

// update cart Router
cartRouter.put(
  "/update/:productId",
  errorHandler(authenticate()),
  errorHandler(validationMiddleware(schema.updateProductInCartSchema)),
  errorHandler(cartController.updateCart)
);

// get cart Router
cartRouter.get(
  "/",
  errorHandler(authenticate()),
  errorHandler(validationMiddleware(schema.getCartSchema)),
  errorHandler(cartController.getCart)
);

export { cartRouter };
