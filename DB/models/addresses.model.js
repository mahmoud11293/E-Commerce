import mongoose from "../global-setup.js";
import { Schema, model } from "mongoose";

const addressSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: Number,
      required: true,
    },
    buildingNumber: {
      type: Number,
      required: true,
    },
    apartmentNumber: {
      type: Number,
      required: true,
    },
    addressLabel: String,
    isDefault: {
      type: Boolean,
      default: false,
    },
    isMarkedAsDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Address =
  mongoose.models.Address || model("Address", addressSchema);
