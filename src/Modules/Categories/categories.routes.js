import { Router } from "express";
const categoryRouter = Router();
// middlewares
import * as middlewares from "../../Middlewares/index.js";
const {
  multerHost,
  getDocumentByName,
  errorHandler,
  authenticate,
  authorization,
} = middlewares;
// utils
import { extensions, systemRoles } from "../../utils/index.js";
const { ADMIN } = systemRoles;
// controller
import * as controller from "./categories.controller.js";
// models
import { Category } from "../../../DB/models/index.js";

// create category Router
categoryRouter.post(
  "/create",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  getDocumentByName(Category),
  authenticate(),
  authorization(ADMIN),
  errorHandler(controller.createCategory)
);

// get category Router
categoryRouter.get(
  "/",
  authenticate(),
  authorization(ADMIN),
  errorHandler(controller.getCategory)
);

// update category Router
categoryRouter.put(
  "/update/:_id",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  getDocumentByName(Category),
  authenticate(),
  authorization(ADMIN),
  errorHandler(controller.updateCategory)
);

// delete category Router
categoryRouter.delete(
  "/delete/:_id",
  authenticate(),
  authorization(ADMIN),
  errorHandler(controller.deleteCategory)
);
export { categoryRouter };
