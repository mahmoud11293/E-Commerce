import { Router } from "express";
const productRouter = Router();
// middlewares
import * as middlewares from "../../Middlewares/index.js";
const {
  multerHost,
  checkIfIdsExsit,
  errorHandler,
  authenticate,
  authorization,
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
  checkIfIdsExsit(Brand),
  authenticate(),
  authorization(ADMIN),
  errorHandler(controller.addProduct)
);
// update product Router
productRouter.put(
  "/update/:productId",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  authenticate(),
  authorization(ADMIN),
  errorHandler(controller.updateProduct)
);
// get all products Router
productRouter.get(
  "/list",
  authenticate(),
  authorization(ADMIN),
  errorHandler(controller.listProducts)
);
// get one product Router
productRouter.get(
  "/product/:productId",
  authenticate(),
  authorization(ADMIN),
  errorHandler(controller.getProduct)
);
// delete product Router
productRouter.delete(
  "/delete/:id",
  authenticate(),
  authorization(ADMIN),
  errorHandler(controller.deleteProduct)
);
export { productRouter };
