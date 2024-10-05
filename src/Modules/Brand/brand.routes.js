import { Router } from "express";
const brandRouter = Router();
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
import * as controller from "./brand.controller.js";
// models
import { Brand } from "../../../DB/models/index.js";

// create brand Router
brandRouter.post(
  "/create",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  getDocumentByName(Brand),
  authenticate(),
  authorization(ADMIN),
  errorHandler(controller.createBrand)
);

// get brand Router
brandRouter.get(
  "/",
  authenticate(),
  authorization(ADMIN),
  errorHandler(controller.getBrands)
);

// update brand Router
brandRouter.put(
  "/update/:_id",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  getDocumentByName(Brand),
  authenticate(),
  authorization(ADMIN),
  errorHandler(controller.updatebrand)
);

// delete brand Router
brandRouter.delete(
  "/delete/:_id",
  authenticate(),
  authorization(ADMIN),
  errorHandler(controller.deleteBrand)
);

export { brandRouter };
