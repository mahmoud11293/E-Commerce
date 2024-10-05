// models
import { Order, Product, Review } from "../../../DB/models/index.js";
// utils
import {
  ErrorClassHandler,
  OrderStatus,
  ReviewStatus,
} from "../../utils/index.js";

// ======================= Add review =======================
/**
 * @api {Post} /reviews/add  - add review
 */
export const addReview = async (req, res, next) => {
  const userId = req.authUser._id;
  const { reviewRating, reviewBody } = req.body;
  const { productId } = req.params;
  // check if the user reviewed this product
  const isAlreadyReviewed = await Review.findOne({ userId, productId });
  if (isAlreadyReviewed) {
    return next(
      new ErrorClassHandler(
        "you already reviewed this product",
        400,
        "you already reviewed this product"
      )
    );
  }
  //check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(
      new ErrorClassHandler("Product not found", 404, "Product not found")
    );
  }
  //check if the user bought this product
  const isBought = await Order.findOne({
    userId,
    "products.productId": productId,
    OrderStatus: OrderStatus.DELIVERED,
  });

  if (!isBought) {
    return next(
      new ErrorClassHandler(
        "you must buy this product first",
        400,
        "you must buy this product first"
      )
    );
  }
  const review = {
    userId,
    productId,
    reviewRating,
    reviewBody,
  };
  const newReview = await Review.create(review);
  res.status(201).json({ messgae: "Review Created", newReview });
};

// ======================= List review =======================
/**
 * @api {Post} /reviews  - list review
 */

export const listReviews = async (req, res, next) => {
  const userId = req.authUser._id;

  const review = await Review.find({
    userId,
    reviewStatus: ReviewStatus.ACCEPTED,
  })
    .populate([
      {
        path: "userId",
        select: "userName email -_id",
      },
      {
        path: "productId",
        select: "title rating -_id",
      },
    ])
    .select("reviewRating reviewBody -_id");

  res.status(200).json({ message: "Review Found", review });
};

// approve or reject review\
export const reviewStatusChanging = async (req, res, next) => {
  const { reviewId } = req.params;
  const { accept, reject } = req.body;

  if (accept && reject) {
    return next(
      new ErrorClassHandler(
        "you can't accept and reject at the same time",
        400,
        "you can't accept and reject at the same time"
      )
    );
  }

  const review = await Review.findByIdAndUpdate(
    reviewId,
    {
      reviewStatus: accept
        ? ReviewStatus.ACCEPTED
        : reject
        ? ReviewStatus.REJECTED
        : ReviewStatus.PENDING,
    },
    { new: true }
  );
  res.status(200).json({ message: "Review Status Changed", review });
};
