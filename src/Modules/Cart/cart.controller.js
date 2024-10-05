// models
import { Cart, Product } from "../../../DB/models/index.js";
// utils
import { ErrorClassHandler } from "../../utils/index.js";
import { checkProductStock } from "./Utils/cart.utils.js";

// ======================= add cart =======================
/**
 * @api { post } /carts/add Add a new cart
 */
export const addCart = async (req, res, next) => {
  // destructuring the Date
  const userId = req.authUser._id;
  const { quantity } = req.body;
  const { productId } = req.params;
  // find the product
  const product = await checkProductStock(productId, quantity);
  if (!product)
    return next(
      new ErrorClassHandler(
        "product not available",
        404,
        "product not available"
      )
    );
  // find cart and if not found create new cart
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    // const subTotal = product.appliedPrice * quantity;
    const newCart = new Cart({
      userId,
      products: [
        { productId: product._id, quantity, price: product.appliedPrice },
      ],
    });
    await newCart.save();
    return res.status(201).json({
      status: "success",
      message: "product added to cart",
      cart: newCart,
    });
  }
  // if cart found add product to cart
  const isProductExist = cart.products.find(
    (product) => product.productId == productId
  );
  // if product already exist in cart
  if (isProductExist)
    return next(
      new ErrorClassHandler(
        "product already exist",
        400,
        "product already exist"
      )
    );
  // if product not exist in cart push a new one
  cart.products.push({
    productId: product._id,
    quantity,
    price: product.appliedPrice,
  });
  // cart.subTotal += product.appliedPrice * quantity;

  await cart.save();
  res.status(200).json({ status: "success", message: "product added", cart });
};

// ======================= remove product from cart =======================
/**
 * @api { put } /carts/remove  remove from cart
 */
export const removeFromCart = async (req, res, next) => {
  // destructuring the Date
  const userId = req.authUser._id;
  const { productId } = req.params;

  const cart = await Cart.findOne({ userId, "products.productId": productId });
  if (!cart)
    return next(
      new ErrorClassHandler("product not in cart", 404, "product not in cart")
    );

  cart.products = cart.products.filter(
    (product) => product.productId != productId
  );

  await cart.save();
  res.status(200).json({
    message: "product removed from cart successfully",
  });
};

// ======================= update product quantity in cart =======================
/**
 * @api { put } /carts/update  update from cart
 */
export const updateCart = async (req, res, next) => {
  const userId = req.authUser._id;
  const { productId } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findOne({ userId, "products.productId": productId });
  if (!cart)
    return next(
      new ErrorClassHandler("product not in cart", 404, "product not in cart")
    );

  const product = await checkProductStock(productId, quantity);
  if (!product)
    return next(
      new ErrorClassHandler(
        "product not available",
        404,
        "product not available"
      )
    );

  const productIndex = cart.products.findIndex(
    (p) => p.productId.toString() == product._id.toString()
  );
  cart.products[productIndex].quantity = quantity;
  // cart.subTotal = 0;
  // cart.products.forEach((product) => {
  //   cart.subTotal += product.price * product.quantity;
  // });

  await cart.save();
  res.status(200).json({
    status: "success",
    message: "product quantity updated",
  });
};
// =======================get cart =======================
/**
 * @api { get } /carts/get  get cart
 */
export const getCart = async (req, res, next) => {
  const userId = req.authUser._id;

  const cart = await Cart.findOne({ userId });
  if (!cart)
    return next(new ErrorClassHandler("cart not found", 404, "cart not found"));
  res.status(200).json({
    status: "success",
    cart,
  });
};
