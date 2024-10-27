import Joi from "joi";
import { generalRules, PaymentMethods } from "../../utils/index.js";

// ==== add order schema ====

export const createOrderSchema = {
  body: Joi.object({
    address: Joi.string().required(),
    addressId: generalRules._id.optional(),
    contactNumber: Joi.string().required(),
    couponCode: Joi.string().optional(),
    shippingFee: Joi.number().required(),
    VAT: Joi.number().required(),
    paymentMethod: Joi.string()
      .valid(...Object.values(PaymentMethods))
      .required(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};

// ==== Cancel order schema ====

export const cancelOrderSchema = {
  params: Joi.object({
    orderId: generalRules._id.required(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};

// ==== Deliver order schema ====

export const deliveredOrderSchema = {
  params: Joi.object({
    orderId: generalRules._id.required(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};

// ==== List orders schema ====

export const listOrdersSchema = {
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};
