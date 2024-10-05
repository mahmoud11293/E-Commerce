// models
import { Coupon, couponChangeLog, User } from "../../../DB/models/index.js";
// utils
import { ErrorClassHandler } from "../../utils/index.js";

// ======================= Create coupon =======================
/**
 * @api {Post} /coupons/create create coupon
 */
export const createCoupon = async (req, res, next) => {
  const { couponCode, couponAmount, couponType, from, till, Users } = req.body;
  // coupon code check
  const isCouponCodeExist = await Coupon.findOne({ couponCode });
  if (isCouponCodeExist)
    return next(
      new ErrorClassHandler(
        "Coupon Code Already Exist",
        400,
        "Coupon Code Already Exist"
      )
    );
  // $in operator
  const userIds = Users.map((user) => user.userId);
  const validUsers = await User.find({ _id: { $in: userIds } });

  if (validUsers.length !== userIds.length)
    return next(new ErrorClassHandler("Invalid User", 400, "Invalid User"));
  console.log(Users);
  const newCoupon = new Coupon({
    couponCode,
    couponAmount,
    couponType,
    from,
    till,
    Users,
    createdBy: req.authUser._id,
  });

  await newCoupon.save();
  res.json({
    status: "Success",
    message: "Coupon created successfully",
    coupon: newCoupon,
  });
};

// ======================= Get all coupons =======================
/**
 * @api {GET} /coupons Get all coupon
 */
export const getCoupons = async (req, res, next) => {
  const { isEnabled } = req.query;
  const filters = {};
  if (isEnabled) {
    filters.isEnabled = isEnabled === "true" ? true : false;
  }

  const coupons = await Coupon.find(filters);
  res.status(200).json({
    status: "Success",
    message: "Coupons fetched successfully",
    coupons,
  });
};
// ======================= Get one coupon =======================
/**
 * @api {GET} /coupons/:couponId Get coupon by id
 */
export const getCouponById = async (req, res, next) => {
  const { couponId } = req.params;
  const coupon = await Coupon.findById(couponId);
  if (!coupon)
    return next(
      new ErrorClassHandler("Coupon Not Found", 404, "Coupon Not Found")
    );
  res.status(200).json({
    status: "Success",
    message: "Coupon fetched successfully",
    coupon,
  });
};

// ======================= Update coupon =======================
/**
 * @api {PUT} /coupons/:couponId update coupon
 */
export const updateCoupon = async (req, res, next) => {
  const { couponId } = req.params;
  const userId = req.authUser._id;
  const { couponCode, couponAmount, couponType, from, till, Users } = req.body;

  const coupon = await Coupon.findById(couponId);
  if (!coupon)
    return next(
      new ErrorClassHandler("Coupon Not Found", 404, "Coupon Not Found")
    );

  const logUpdateObject = { couponId, updatedBy: userId, changes: {} };
  if (couponCode) {
    const isCouponExist = await Coupon.findOne({ couponCode });
    if (isCouponExist)
      return next(
        new ErrorClassHandler(
          "Coupon Code Already Exist",
          400,
          "Coupon Code Already Exist"
        )
      );
    coupon.couponCode = couponCode;
    logUpdateObject.changes.couponCode = couponCode;
  }

  if (couponAmount) {
    coupon.couponAmount = couponAmount;
    logUpdateObject.changes.couponAmount = couponAmount;
  }

  if (couponType) {
    coupon.couponType = couponType;
    logUpdateObject.changes.couponType = couponType;
  }

  if (from) {
    coupon.from = from;
    logUpdateObject.changes.from = from;
  }

  if (till) {
    coupon.till = till;
    logUpdateObject.changes.till = till;
  }

  await coupon.save();
  const log = await new couponChangeLog(logUpdateObject).save();

  res.status(200).json({
    status: "Success",
    message: "Coupon updated successfully",
    coupon,
    log,
  });
};
// ======================= Disable or Enable Coupon =======================
/**
 * @api {PATCH} /coupons/:couponId Disable or Enable coupon
 */
export const disableOrEnableCoupon = async (req, res, next) => {
  const { couponId } = req.params;
  const userId = req.authUser._id;
  const { enable } = req.body;

  const coupon = await Coupon.findById(couponId);
  if (!coupon)
    return next(
      new ErrorClassHandler("Coupon Not Found", 404, "Coupon Not Found")
    );

  const logUpdateObject = { couponId, updatedBy: userId, changes: {} };

  if (enable === true) {
    coupon.isEnabled = true;
    logUpdateObject.changes.isEnabled = true;
  }
  if (enable === false) {
    coupon.isEnabled = false;
    logUpdateObject.changes.isEnabled = false;
  }

  await coupon.save();
  const log = await new couponChangeLog(logUpdateObject).save();

  res.status(200).json({
    status: "Success",
    message: "Coupon updated successfully",
    coupon,
    log,
  });
};
