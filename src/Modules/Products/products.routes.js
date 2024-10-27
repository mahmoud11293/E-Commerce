import { Router } from "express";
const productRouter = Router();
import * as schema from "./products.schema.js";
// middlewares
import * as middlewares from "../../Middlewares/index.js";
const {
  multerHost,
  getDocumentByName,
  errorHandler,
  authenticate,
  authorization,
  validationMiddleware,
} = middlewares;
// utils
import { extensions, systemRoles } from "../../utils/index.js";
const { ADMIN } = systemRoles;
// controller
import * as controller from "./products.controller.js";
// models
import { Brand } from "../../../DB/models/index.js";

// add product Router
productRouter.post(
  "/add",
  multerHost({ allowedExtensions: extensions.Images }).array("image", 5),
  errorHandler(validationMiddleware(schema.createProductSchema)),
  errorHandler(getDocumentByName(Brand)),
  errorHandler(authenticate()),
  errorHandler(authorization(ADMIN)),
  errorHandler(controller.addProduct)
);
// update product Router
productRouter.put(
  "/update/:productId",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  errorHandler(validationMiddleware(schema.updateProductSchema)),
  errorHandler(authenticate()),
  errorHandler(authorization(ADMIN)),
  errorHandler(controller.updateProduct)
);
// get all products Router
productRouter.get(
  "/list",
  errorHandler(authenticate()),
  errorHandler(authorization(ADMIN)),
  errorHandler(controller.listProducts)
);
// get one product Router
productRouter.get(
  "/product/:productId",
  errorHandler(authenticate()),
  errorHandler(authorization(ADMIN)),
  errorHandler(controller.getProduct)
);
// delete product Router
productRouter.delete(
  "/delete/:id",
  errorHandler(validationMiddleware(schema.deleteProductSchema)),
  errorHandler(authenticate()),
  errorHandler(authorization(ADMIN)),
  errorHandler(controller.deleteProduct)
);
export { productRouter };
