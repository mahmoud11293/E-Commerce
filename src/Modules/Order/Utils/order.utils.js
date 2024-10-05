import { DateTime } from "luxon";
import { Coupon } from "../../../../DB/models/index.js";
import { DiscountType } from "../../../utils/index.js";

/**
 * @param {*} couponCode
 * @param {*} userId
 * @returns {message: String, error: Boolean, coupon: Object}
 */

export const validateCoupon = async (couponCode, userId) => {
  // get coupon by coponCode
  const coupon = await Coupon.findOne({ couponCode });
  if (!coupon) {
    return { message: "Invalid coupon code", error: true };
  }

  // check if coupon enabled
  if (!coupon.isEnabled || !DateTime.now() > DateTime.fromJSDate(coupon.till)) {
    return { message: "Coupon is not enabled", error: true };
  }

  // check if coupon not started yet
  if (DateTime.now() < DateTime.fromJSDate(coupon.from)) {
    return {
      message: ` Coupon is not started yet, will start on ${coupon.from} `,
      error: true,
    };
  }

  // check if user not eligible to use coupon
  const isUserNotEligible = coupon.Users.some(
    (user) =>
      user.userId.toString() !== userId.toString() ||
      (user.userId.toString() === userId.toString() &&
        user.maxCount <= user.usageCount)
  );
  console.log(isUserNotEligible);
  if (!isUserNotEligible) {
    return { message: "User not eligible to use this coupon", error: true };
  }

  return { error: false, coupon };
};

export const applyCoupon = async (coupon, subTotal) => {
  let total = subTotal;
  const { couponType, couponAmount } = coupon;
  if (couponType == DiscountType.PERCENTAGE) {
    total = subTotal - (subTotal * couponAmount) / 100;
  } else if (couponType == DiscountType.FIXED) {
    if (subTotal > couponAmount) {
      return total;
    }
    total = subTotal - couponAmount;
  }
  return total;
};
