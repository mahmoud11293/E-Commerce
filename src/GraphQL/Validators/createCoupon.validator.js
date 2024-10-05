import Joi from "joi";
import { DiscountType, generalRules } from "../../utils/index.js";

export const createCouponGraphQLSchema = Joi.object({
  couponCode: Joi.string().required(),
  from: Joi.date().greater(Date.now()).required(),
  till: Joi.date().greater(Joi.ref("from")).required(),
  Users: Joi.array().items(
    Joi.object({
      userId: generalRules._id.required(),
      maxCount: Joi.number().min(1).required(),
    })
  ),
  couponType: Joi.string().valid(...Object.values(DiscountType)),
  couponAmount: Joi.number()
    .when("couponType", {
      is: Joi.string().valid(DiscountType.PERCENTAGE),
      then: Joi.number().max(100),
    })
    .min(1)
    .required()
    .messages({
      "number.min": "Coupon amount must be greater than 0",
      "number.max": "Coupon amount must be less than 100",
    }),
  token: Joi.string().required(),
});
