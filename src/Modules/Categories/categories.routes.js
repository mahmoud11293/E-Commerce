import { Router } from "express";
const categoryRouter = Router();
import * as schema from "./categories.schema.js";
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
import * as controller from "./categories.controller.js";
// models
import { Category } from "../../../DB/models/index.js";

// create category Router
categoryRouter.post(
  "/create",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  errorHandler(validationMiddleware(schema.createCategorySchema)),
  errorHandler(getDocumentByName(Category)),
  errorHandler(authenticate()),
  errorHandler(authorization(ADMIN)),
  errorHandler(controller.createCategory)
);

// get category Router
categoryRouter.get(
  "/",
  errorHandler(validationMiddleware(schema.getCategoriesSchema)),
  errorHandler(authenticate()),
  errorHandler(authorization(ADMIN)),
  errorHandler(controller.getCategory)
);

// update category Router
categoryRouter.put(
  "/update/:_id",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  errorHandler(validationMiddleware(schema.updateCategorySchema)),
  errorHandler(getDocumentByName(Category)),
  errorHandler(authenticate()),
  errorHandler(authorization(ADMIN)),
  errorHandler(controller.updateCategory)
);

// delete category Router
categoryRouter.delete(
  "/delete/:_id",
  errorHandler(validationMiddleware(schema.deleteCategorySchema)),
  errorHandler(authenticate()),
  errorHandler(authorization(ADMIN)),
  errorHandler(controller.deleteCategory)
);
export { categoryRouter };
