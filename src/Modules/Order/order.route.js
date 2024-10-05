import { Router } from "express";
const orderRouter = Router();
//controller
import * as orderController from "./order.controller.js";
//middleware
import * as middleware from "../../Middlewares/index.js";
const { authenticate, errorHandler } = middleware;

// creat order Router
orderRouter.post(
  "/create",
  authenticate(),
  errorHandler(orderController.createOrder)
);

// cancell order Router
orderRouter.put(
  "/cancel/:orderId",
  authenticate(),
  errorHandler(orderController.cancelOrder)
);

// Deliver order Router
orderRouter.put(
  "/deliver/:orderId",
  authenticate(),
  errorHandler(orderController.deliveredOrder)
);

// List orders Router
orderRouter.get(
  "/list",
  authenticate(),
  errorHandler(orderController.listOrders)
);

// Stripe Payment Router
orderRouter.post(
  "/stripePayment/:orderId",
  authenticate(),
  errorHandler(orderController.paymentWithStripe)
);

// Stripe Webhook Router
orderRouter.post("/webhook", errorHandler(orderController.stripe));

// Stripe Refund Router
orderRouter.post(
  "/refund/:orderId",
  authenticate(),
  errorHandler(orderController.refundPaymentData)
);

export { orderRouter };
