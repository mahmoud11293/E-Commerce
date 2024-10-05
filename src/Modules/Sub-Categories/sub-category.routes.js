import { Router } from "express";
const subCategoryRouter = Router();
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
import * as controller from "./sub-category.controller.js";
// models
import { SubCategory } from "../../../DB/models/sub-category.model.js";

// create subCategory Router
subCategoryRouter.post(
  "/create",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  getDocumentByName(SubCategory),
  authenticate(),
  authorization(ADMIN),
  errorHandler(controller.createSubCategory)
);

// get subCategory Router
subCategoryRouter.get(
  "/",
  authenticate(),
  authorization(ADMIN),
  errorHandler(controller.getSubCategory)
);

// update subCategory Router
subCategoryRouter.put(
  "/update/:_id",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  getDocumentByName(SubCategory),
  authenticate(),
  authorization(ADMIN),
  errorHandler(controller.updateSubCategory)
);

// delete subCategory Router
subCategoryRouter.delete(
  "/delete/:_id",
  authenticate(),
  authorization(ADMIN),
  errorHandler(controller.deleteSubCategory)
);

export { subCategoryRouter };
