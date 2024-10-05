import { Router } from "express";
const addressRouter = Router();
//controller
import * as addressController from "./address.controller.js";
//middleware
import * as middleware from "../../Middlewares/index.js";
const { authenticate, errorHandler } = middleware;

// add address Router
addressRouter.post(
  "/add",
  authenticate(),
  errorHandler(addressController.addAddress)
);
// update address Router
addressRouter.put(
  "/update/:addressId",
  authenticate(),
  errorHandler(addressController.updateAddress)
);
// delete address Router
addressRouter.put(
  "/soft-delete/:addressId",
  authenticate(),
  errorHandler(addressController.deleteAddress)
);

// get address Router
addressRouter.get(
  "/list",
  authenticate(),
  errorHandler(addressController.getAddresses)
);

export { addressRouter };
