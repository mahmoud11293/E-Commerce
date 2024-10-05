import { Router } from "express";
const couponRouter = Router();
//controller
import * as couponController from "./coupon.controller.js";
//middleware
import * as middleware from "../../Middlewares/index.js";
const { authenticate, errorHandler, validationMiddleware, authorization } =
  middleware;
// utils
import { systemRoles } from "../../utils/index.js";
const { ADMIN } = systemRoles;
// Validation Schema
import { CreateCouponSchema, UpdateCouponSchema } from "./coupon.schema.js";

// create coupon Router
couponRouter.post(
  "/create",
  authenticate(),
  authorization(ADMIN),
  validationMiddleware(CreateCouponSchema),
  errorHandler(couponController.createCoupon)
);

// get coupon Router
couponRouter.get(
  "/",
  authenticate(),
  authorization(ADMIN),
  errorHandler(couponController.getCoupons)
);

// get coupon by id Router
couponRouter.get(
  "/details/:couponId",
  authenticate(),
  authorization(ADMIN),
  errorHandler(couponController.getCouponById)
);

// update coupon Router
couponRouter.put(
  "/update/:couponId",
  authenticate(),
  authorization(ADMIN),
  validationMiddleware(UpdateCouponSchema),
  errorHandler(couponController.updateCoupon)
);

// update Enabled coupon Router
couponRouter.patch(
  "/enable/:couponId",
  authenticate(),
  authorization(ADMIN),
  errorHandler(couponController.disableOrEnableCoupon)
);

export { couponRouter };
