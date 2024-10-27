import Joi from "joi";
import { generalRules } from "../../utils/index.js";

// ==== add cart schema ====
export const addCartSchema = {
  body: Joi.object({
    quantity: Joi.number().min(1).required(),
  }),
  params: Joi.object({
    productId: Joi.string().required(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};

// ==== remove cart schema ====

export const removeFromCart = {
  params: Joi.object({
    productId: Joi.string().required(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};

// ==== update cart schema ====

export const updateProductInCartSchema = {
		body: Joi.object({
			quantity: Joi.number().min(1).required(),
		}),
		params: Joi.object({
			productId: Joi.string().required(),
		}),
		headers: Joi.object({
			token: Joi.string().required(),
			...generalRules.headers,
		}),
}

// ==== get cart schema ====

export const getCartSchema = {
	headers: Joi.object({
		token: Joi.string().required(),
		...generalRules.headers,
	}),
}