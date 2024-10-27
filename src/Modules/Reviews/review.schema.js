import Joi from "joi";
import { generalRules } from "../../utils/index.js";

// ==== add review schema ====

export const addReviewSchema = {
  body: Joi.object({
    reviewRating: Joi.number().required(),
    reviewBody: Joi.string().optional(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
  params: Joi.object({
    productId: generalRules._id.required(),
  }),
};

// ==== approve or reject review schema ====

export const reviewStatusChangingSchema = {
  body: Joi.object({
    accept: Joi.string().optional(),
    reject: Joi.string().optional(),
  }),
  params: Joi.object({
    reviewId: generalRules._id.required(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};
