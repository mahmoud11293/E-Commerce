import mongoose from "../global-setup.js";
import slugify from "slugify";
import {
  Badges,
  calculateProductPrice,
  DiscountType,
} from "../../src/utils/index.js";
const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    // string section
    title: {
      type: String,
      requiered: true,
      trim: true,
    },
    slug: {
      type: String,
      requiered: true,
      lowercase: true,
      default: function () {
        return slugify(this.title, { lower: true, replacement: "-" });
      },
    },
    overview: String,
    specs: Object,
    badge: {
      type: String,
      enum: Object.values(Badges),
    },
    // Number Section
    price: {
      type: Number,
      requiered: true,
      min: 50,
    },
    appliedDiscount: {
      amount: {
        type: Number,
        min: 0,
        default: 0,
      },
      type: {
        type: String,
        enum: Object.values(DiscountType),
        default: DiscountType.PERCENTAGE,
      },
    },
    appliedPrice: {
      type: Number,
      required: true,
      default: function () {
        return calculateProductPrice(this.price, this.appliedDiscount);
      },
    }, // price, price - discount
    stock: {
      type: Number,
      required: true,
      min: 10,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    Images: {
      URLs: [
        {
          secure_url: {
            type: String,
            required: true,
          },
          public_id: {
            type: String,
            required: true,
            unique: true,
          },
        },
      ],
      customId: {
        type: String,
        required: true,
        unique: true,
      },
    },
    // Ids section
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, id: false }
);

productSchema.virtual("Reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "productId",
});

export const Product =
  mongoose.models.Product || model("Product", productSchema);
