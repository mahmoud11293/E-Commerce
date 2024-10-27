import Joi from "joi";
import { generalRules } from "../../utils/index.js";

// ==== create sub-category schema ====

export const createSubCategorySchema = {
  body: Joi.object({
    name: Joi.string().required(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
  query: Joi.object({
    categoryId: Joi.string().required(),
  }),
};

// ==== get sub-category schema ====

export const getSubCategoriesSchema = {
  query: Joi.object({
    id: Joi.string().optional(),
    name: Joi.string().optional(),
    slug: Joi.string().optional(),
  }).custom((value, helpers) => {
    // Check if at least one of id, name, or slug is present
    const { id, name, slug } = value;
    if (!id && !name && !slug) {
      return helpers.message("At least one of id, name, or slug is required");
    }
    return value; // Return validated value
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};

// ==== update sub-category schema ====

export const updateSubCategorySchema = {
  body: Joi.object({
    name: Joi.string().optional(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
  params: Joi.object({
    _id: generalRules._id.required(),
  }),
};

// ==== delete sub-category schema ====

export const deleteSubCategorySchema = {
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
  params: Joi.object({
    _id: generalRules._id.required(),
  }),
};
