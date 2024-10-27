import { Router } from "express";
const orderRouter = Router();
import * as schema from "./order.schema.js";
//controller
import * as orderController from "./order.controller.js";
//middleware
import * as middleware from "../../Middlewares/index.js";
const { authenticate, errorHandler, validationMiddleware } = middleware;

// creat order Router
orderRouter.post(
  "/create",
  errorHandler(authenticate()),
  errorHandler(validationMiddleware(schema.createOrderSchema)),
  errorHandler(orderController.createOrder)
);

// cancell order Router
orderRouter.put(
  "/cancel/:orderId",
  errorHandler(authenticate()),
  errorHandler(validationMiddleware(schema.cancelOrderSchema)),
  errorHandler(orderController.cancelOrder)
);

// Deliver order Router
orderRouter.put(
  "/deliver/:orderId",
  errorHandler(authenticate()),
  errorHandler(validationMiddleware(schema.deliveredOrderSchema)),
  errorHandler(orderController.deliveredOrder)
);

// List orders Router
orderRouter.get(
  "/list",
  errorHandler(authenticate()),
  errorHandler(validationMiddleware(schema.listOrdersSchema)),
  errorHandler(orderController.listOrders)
);

// Stripe Payment Router
orderRouter.post(
  "/stripePayment/:orderId",
  errorHandler(authenticate()),
  errorHandler(orderController.paymentWithStripe)
);

// Stripe Webhook Router
orderRouter.post("/webhook", errorHandler(orderController.stripe));

// Stripe Refund Router
orderRouter.post(
  "/refund/:orderId",
  errorHandler(authenticate()),
  errorHandler(orderController.refundPaymentData)
);

export { orderRouter };
