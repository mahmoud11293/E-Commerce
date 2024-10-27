import { Schema, model } from "mongoose";
import mongoose from "../global-setup.js";
import { hashSync } from "bcrypt";
import { systemRoles } from "../../src/utils/index.js";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female"],
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    userType: {
      type: String,
      enum: Object.values(systemRoles),
      default: systemRoles.BUYER,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isMarkedAsDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    passwordChangeAt: Date,
    otp: String,
    provider: {
      type: String,
      enum: ["System", "GOOGLE"],
      default: "System",
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = hashSync(this.password, +process.env.SALT_ROUNDS);
  }
  next();
});

export const User = mongoose.models.User || model("User", userSchema);
