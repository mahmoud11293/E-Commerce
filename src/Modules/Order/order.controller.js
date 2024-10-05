import { DateTime } from "luxon";
// models
import { Cart, Order, Address, Product } from "../../../DB/models/index.js";
// utils
import {
  ApiFeature,
  ErrorClassHandler,
  OrderStatus,
  PaymentMethods,
} from "../../utils/index.js";
import { calculateCartTotal } from "../Cart/Utils/cart.utils.js";
import { applyCoupon, validateCoupon } from "./Utils/order.utils.js";
import {
  createCheckoutSession,
  createStripeCoupon,
  confirm,
  createPaymentIntent,
  refundPayment,
} from "../../payment-handler/stripe.js";

// ======================= Create order =======================
/**
 * @api {Post} /orders/create  - create order
 */
export const createOrder = async (req, res, next) => {
  // destructuring the Data
  const userId = req.authUser._id;
  const {
    address,
    addressId,
    contactNumber,
    couponCode,
    shippingFee,
    VAT,
    paymentMethod,
  } = req.body;
  // find logged in user's cart with products
  const cart = await Cart.findOne({ userId }).populate("products.productId");
  // check if no products in cart or no cart exist
  if (!cart || !cart.products.length)
    return next(new ErrorClassHandler("Cart is empty", 404, "Cart is empty"));
  // check if product sold out
  const isSoldOut = cart.products.find(
    (product) => product.productId.stock < product.quantity
  );
  if (isSoldOut)
    return next(
      new ErrorClassHandler(
        `Product ${isSoldOut.productId.title} is sold out`,
        404,
        `Product ${isSoldOut.productId.title} is sold out`
      )
    );
  // calculate new subtotal
  const subTotal = calculateCartTotal(cart.products);
  let total = subTotal + VAT + shippingFee;

  let coupon = null;
  if (couponCode) {
    const isCouponValid = await validateCoupon(couponCode, userId);
    if (isCouponValid.error) {
      return next(
        new ErrorClassHandler(isCouponValid.message, 404, isCouponValid.message)
      );
    }
    coupon = isCouponValid.coupon;

    total = applyCoupon(subTotal, coupon);
  }

  // check addresses
  if (!address && !addressId) {
    return next(
      new ErrorClassHandler("Address is required", 400, "Address is required")
    );
  }
  // check if address is valid
  if (addressId) {
    const addressInfo = await Address.findOne({ _id: addressId, userId });
    if (!addressInfo)
      return next(
        new ErrorClassHandler("Invalid address", 400, "Invalid address")
      );
  }

  let orderStatus = OrderStatus.PENDING;
  if (paymentMethod === PaymentMethods.CASH) {
    orderStatus = OrderStatus.PLACED;
  }
  // prepare order object
  const orderObject = new Order({
    userId,
    address,
    addressId,
    contactNumber,
    couponId: coupon?._id,
    shippingFee,
    VAT,
    paymentMethod,
    subTotal,
    total,
    orderStatus,
    products: cart.products,
    estimatedDeliveryDate: DateTime.now()
      .plus({ day: 7 })
      .toFormat("yyyy-MM-dd"),
  });
  await orderObject.save();

  // clear the cart
  cart.products = [];
  await cart.save();

  res.status(201).json({ message: "Order Created", order: orderObject });
};

// ======================= Cancel order =======================
/**
 * @api {Put} /orders/cancel/:orderId  - cancel order
 */

export const cancelOrder = async (req, res, next) => {
  const userId = req.authUser._id;
  const { orderId } = req.params;
  const order = await Order.findOne({
    _id: orderId,
    userId,
    orderStatus: {
      $in: [OrderStatus.PENDING, OrderStatus.PLACED, OrderStatus.CONFIRMED],
    },
  });
  if (!order) {
    return next(new ErrorClass("Order not found", 404, "Order not found"));
  }
  const orderDate = DateTime.fromJSDate(order.createdAt);
  const currentDate = DateTime.now();
  const diff = Math.ceil(
    Number(currentDate.diff(orderDate, "days").toObject().days).toFixed(2)
  );
  if (diff > 3) {
    return next(
      new ErrorClass(
        "Cannot cancel order after 3 days",
        400,
        "Cannot cancel order after 3 days"
      )
    );
  }

  order.orderStatus = OrderStatus.CANCELLED;
  order.cancelledAt = DateTime.now();
  order.cancelledBy = userId;
  await Order.updateOne({ _id: orderId }, order);
  // update stock of products
  for (const product of order.products) {
    const prod = await Product.findByIdAndUpdate(
      product.productId,
      { $inc: { stock: product.quantity } },
      { new: true }
    );
  }
  res.status(200).json({ msg: "order cancelled", order });
};

// ======================= Deliver order =======================
/**
 * @api {Put} /orders/deliver/:orderId  - deliver order
 */
export const deliveredOrder = async (req, res, next) => {
  const userId = req.authUser._id;
  const { orderId } = req.params;
  const order = await Order.findOne({
    _id: orderId,
    userId,
    orderStatus: { $in: [OrderStatus.PLACED, OrderStatus.CONFIRMED] },
  });
  if (!order) {
    return next(new ErrorClass("Order not found", 404, "Order not found"));
  }

  order.orderStatus = OrderStatus.DELIVERED;
  order.deliveredAt = DateTime.now();
  order.deliveredBy = userId;
  await Order.updateOne({ _id: orderId }, order);
  res.status(200).json({ message: "Order delivered ", order });
};

// ======================= List orders =======================
/**
 * @api {Get} /orders  - List orders
 */

export const listOrders = async (req, res, next) => {
  const userId = req.authUser._id;
  const query = { userId, ...req.query };
  const populateArray = [
    {
      path: "products.productId",
      select: "title Images rating appliedPrice",
    },
  ];
  const orderList = new ApiFeature(Order, query, populateArray)
    .filters()
    .sort()
    .pagination();
  const orders = await orderList.mongooseQuery;

  res.status(200).json({
    status: "success",
    message: "orders list",
    data: orders,
  });
};

// ======================= Payment With Stripe =======================

export const paymentWithStripe = async (req, res, next) => {
  const userId = req.authUser._id;
  const { orderId } = req.params;

  const order = await Order.findOne({
    _id: orderId,
    userId,
    orderStatus: OrderStatus.PENDING,
  }).populate("products.productId");
  if (!order) {
    return next(
      new ErrorClassHandler("Order not found", 404, "Order not found")
    );
  }

  //create payment object
  const paymentObject = {
    customer_email: req.authUser.email,
    metadata: { orderId: order._id.toString() },
    discounts: [],
    line_items: order.products.map((product) => {
      return {
        price_data: {
          currency: "egp",
          unit_amount: product.price * 100, // in cents
          product_data: {
            name: req.authUser.userName,
          },
        },
        quantity: product.quantity,
      };
    }),
  };

  //create coupon
  if (order.couponId) {
    const stripeCoupon = await createStripeCoupon({
      couponId: order.couponId,
    });
    if (stripeCoupon.status) {
      return next(
        new ErrorClassHandler(stripeCoupon.message, 400, stripeCoupon.message)
      );
    }
    paymentObject.discounts.push({ coupon: stripeCoupon.id });
  }

  const checkoutSession = await createCheckoutSession(paymentObject);

  const paymentIntent = await createPaymentIntent({
    amount: order.total,
    currency: "egp",
  });

  order.payment_intent = paymentIntent.id;
  await Order.updateOne(
    { _id: orderId, orderStatus: OrderStatus.CONFIRMED },
    order,
    { new: true }
  );

  res.status(200).json({
    message: "Payment Session Created",
    checkoutSession,
    paymentIntent,
  });
};

// ======================= Stripe Webhook Local =======================
export const stripe = async (req, res, next) => {
  const orderId = req.body.data.object.metadata.orderId;
  const confirmOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      orderStatus: OrderStatus.CONFIRMED,
    },
    { new: true }
  );
  const confirmPaymentIntent = await confirm({
    paymentIntentId: confirmOrder.payment_intent,
  });

  res.status(200).json({ message: "payment success", confirmPaymentIntent });
};

// ======================= Refund Payment Data =======================

export const refundPaymentData = async (req, res, next) => {
  const { orderId } = req.params;

  const order = await Order.findOne({
    _id: orderId,
    orderStatus: OrderStatus.CONFIRMED,
  });
  console.log(order);

  if (!order) {
    return next(
      new ErrorClassHandler("Order not found", 404, "Order not found")
    );
  }
  const refund = await refundPayment({
    paymentIntentId: order.payment_intent,
  });
  console.log(refund.status);

  if (refund.status) {
    return next(new ErrorClassHandler(refund.message, 400, refund.message));
  }
  order.orderStatus = OrderStatus.REFUNDED;
  await order.save();
  res.status(200).json({ message: "Payment Refunded Successfully" });
};
