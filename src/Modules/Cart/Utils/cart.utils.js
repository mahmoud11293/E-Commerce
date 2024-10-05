import { Product } from "../../../../DB/models/index.js";

export const checkProductStock = async (productId, quantity) => {
  return await Product.findOne({ _id: productId, stock: { $gte: quantity } });
};

export const calculateCartTotal = (products) => {
  let SubTotal = 0;
  products.forEach((product) => {
    SubTotal += product.price * product.quantity;
  });
  return SubTotal;
};
