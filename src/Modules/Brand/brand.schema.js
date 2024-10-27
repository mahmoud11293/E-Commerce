import Joi from "joi";
import { generalRules } from "../../utils/index.js";

// ==== add Brand schema ====

export const createBrandSchema = {
  body: Joi.object({
    name: Joi.string().required(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
  query: Joi.object({
    category: Joi.string().required(),
    subCategory: Joi.string().required(),
  }),
};

// ==== get Brand schema ====

export const getBrandSchema = {
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

// ==== update Brand schema ====

export const updateBrandSchema = {
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

// ==== delete Brand schema ====

export const deleteBrandSchema = {
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
  params: Joi.object({
    _id: generalRules._id.required(),
  }),
};
