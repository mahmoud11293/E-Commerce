import Joi from "joi";
import { couponType } from "../../utils/index.js";
import { generalRules } from "../../utils/index.js";

export const CreateCouponSchema = {
  body: Joi.object({
    couponCode: Joi.string().required(),
    from: Joi.date().greater(Date.now()).required(),
    till: Joi.date().greater(Joi.ref("from")).required(),
    Users: Joi.array().items(
      Joi.object({
        userId: generalRules._id.required(),
        maxCount: Joi.number().min(1).required(),
      })
    ),
    couponType: Joi.string().valid(...Object.values(couponType)),
    couponAmount: Joi.number()
      .when("couponType", {
        is: Joi.string().valid(couponType.PERCENTAGE),
        then: Joi.number().max(100),
      })
      .min(1)
      .required()
      .messages({
        "number.min": "Coupon amount must be greater than 0",
        "number.max": "Coupon amount must be less than 100",
      }),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};

export const UpdateCouponSchema = {
  body: Joi.object({
    couponCode: Joi.string().optional(),
    from: Joi.date().greater(Date.now()).optional(),
    till: Joi.date().greater(Joi.ref("from")).optional(),
    Users: Joi.array()
      .items(
        Joi.object({
          userId: generalRules._id.required(),
          maxCount: Joi.number().min(1).required(),
        })
      )
      .optional(),
    couponType: Joi.string().valid(...Object.values(couponType)),
    couponAmount: Joi.number()
      .when("couponType", {
        is: Joi.string().valid(couponType.PERCENTAGE),
        then: Joi.number().max(100),
      })
      .min(1)
      .optional()
      .messages({
        "number.min": "Coupon amount must be greater than 0",
        "number.max": "Coupon amount must be less than 100",
      }),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
  params: Joi.object({
    couponId: generalRules._id.required(),
  }),
};
