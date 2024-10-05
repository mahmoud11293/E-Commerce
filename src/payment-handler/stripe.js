import Stripe from "stripe";
import { couponType, ErrorClassHandler } from "../utils/index.js";
import { Coupon } from "../../DB/models/index.js";

// ================ Create checkout session ================
export const createCheckoutSession = async ({
  customer_email,
  metadata,
  discounts,
  line_items,
}) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"], //default
    mode: "payment",
    customer_email,
    metadata,
    success_url: process.env.SUCCESS_URL,
    cancel_url: process.env.CANCEL_URL,
    discounts,
    line_items,
  });
  return session;
};

// ================ Create stripe coupon ================
export const createStripeCoupon = async ({ couponId }) => {
  const findCoupon = await Coupon.findById(couponId);
  if (!findCoupon) {
    return next(
      new ErrorClassHandler("Coupon not found", 404, "Coupon not found")
    );
  }
  let couponObject = {};
  if (findCoupon.couponType == couponType.AMOUNT) {
    couponObject = {
      name: findCoupon.couponCode,
      amount_off: findCoupon.couponAmount * 100,
      currency: "egp",
    };
  }
  if (findCoupon.couponType == couponType.PERCENTAGE) {
    couponObject = {
      name: findCoupon.couponCode,
      percent_off: findCoupon.couponAmount,
    };
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const stripeCoupon = await stripe.coupons.create(couponObject);
  return stripeCoupon;
};

// ================ create payment method ================
export const createPaymentMethod = async ({ token }) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const paymentMethod = await stripe.paymentMethods.create({
    type: "card",
    card: {
      token,
    },
  });
  return paymentMethod;
};

// ================ Create Payment Intent With Stripe ================

export const createPaymentIntent = async ({ amount, currency }) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const paymentMethod = await createPaymentMethod({
    token: "tok_visa",
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
    payment_method: paymentMethod.id,
  });
  return paymentIntent;
};
// ================ retrieve payment intent ================
export const retrievePaymentIntent = async ({ paymentIntentId }) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  console.log(paymentIntent);

  return paymentIntent;
};
// ================ confirm payment intent ================
export const confirm = async ({ paymentIntentId }) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const paymentDetails = await retrievePaymentIntent({ paymentIntentId });
  const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
    payment_method: paymentDetails.payment_method,
  });
  return paymentIntent;
};

// ================ Refund Payment ================

export const refundPayment = async ({ paymentIntentId }) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
  });
  return refund;
};
