import { Router } from "express";
const addressRouter = Router();
import * as schema from "./adress.schema.js";
//controller
import * as addressController from "./address.controller.js";
//middleware
import * as middleware from "../../Middlewares/index.js";
const { authenticate, errorHandler, validationMiddleware } = middleware;

// add address Router
addressRouter.post(
  "/add",
  errorHandler(validationMiddleware(schema.addAdressSchema)),
  errorHandler(authenticate()),
  errorHandler(addressController.addAddress)
);
// update address Router
addressRouter.put(
  "/update/:addressId",
  errorHandler(validationMiddleware(schema.updateAdressSchema)),
  errorHandler(authenticate()),
  errorHandler(addressController.updateAddress)
);
// delete address Router
addressRouter.put(
  "/soft-delete/:addressId",
  errorHandler(validationMiddleware(schema.deleteAdressSchema)),
  errorHandler(authenticate()),
  errorHandler(addressController.deleteAddress)
);

// get address Router
addressRouter.get(
  "/list",
  errorHandler(validationMiddleware(schema.listAdressSchema)),
  errorHandler(authenticate()),
  errorHandler(addressController.getAddresses)
);

export { addressRouter };
