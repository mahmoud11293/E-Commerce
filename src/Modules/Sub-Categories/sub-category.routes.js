import { Router } from "express";
const subCategoryRouter = Router();
import * as schema from "./sub-category.schema.js";
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
import * as controller from "./sub-category.controller.js";
// models
import { SubCategory } from "../../../DB/models/sub-category.model.js";

// create subCategory Router
subCategoryRouter.post(
  "/create",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  errorHandler(validationMiddleware(schema.createSubCategorySchema)),
  errorHandler(getDocumentByName(SubCategory)),
  errorHandler(authenticate()),
  errorHandler(authorization(ADMIN)),
  errorHandler(controller.createSubCategory)
);

// get subCategory Router
subCategoryRouter.get(
  "/",
  errorHandler(validationMiddleware(schema.getSubCategoriesSchema)),
  errorHandler(authenticate()),
  errorHandler(authorization(ADMIN)),
  errorHandler(controller.getSubCategory)
);

// update subCategory Router
subCategoryRouter.put(
  "/update/:_id",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  errorHandler(validationMiddleware(schema.updateSubCategorySchema)),
  errorHandler(getDocumentByName(SubCategory)),
  errorHandler(authenticate()),
  errorHandler(authorization(ADMIN)),
  errorHandler(controller.updateSubCategory)
);

// delete subCategory Router
subCategoryRouter.delete(
  "/delete/:_id",
  errorHandler(validationMiddleware(schema.deleteSubCategorySchema)),
  errorHandler(authenticate()),
  errorHandler(authorization(ADMIN)),
  errorHandler(controller.deleteSubCategory)
);

export { subCategoryRouter };
