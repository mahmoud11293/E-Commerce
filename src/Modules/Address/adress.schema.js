import Joi from "joi";
import { generalRules } from "../../utils/index.js";

// ==== add adress schema ====
export const addAdressSchema = {
  body: Joi.object({
    country: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.number().required(),
    buildingNumber: Joi.number().required(),
    apartmentNumber: Joi.number().required(),
    addressLabel: Joi.string().required(),
    setAsDefault: Joi.boolean().required(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};

// ==== update adress schema ====

export const updateAdressSchema = {
  body: Joi.object({
    country: Joi.string().optional(),
    city: Joi.string().optional(),
    postalCode: Joi.number().optional(),
    buildingNumber: Joi.number().optional(),
    apartmentNumber: Joi.number().optional(),
    addressLabel: Joi.string().optional(),
    setAsDefault: Joi.boolean().optional(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
  params: Joi.object({
    addressId: generalRules._id.required(),
  }),
};

// ==== delete adress schema ====

export const deleteAdressSchema = {
  params: Joi.object({
    addressId: generalRules._id.required(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};

// ==== List adress schema ====

export const listAdressSchema = {
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};
