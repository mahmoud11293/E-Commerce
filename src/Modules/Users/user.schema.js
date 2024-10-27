import Joi from "joi";
import { generalRules } from "../../utils/index.js";

// ==== signUp schema ====
export const signUpSchema = {
  body: Joi.object({
    userName: Joi.string().min(3).max(30).alphanum().required(),
    email: generalRules.email.required(),
    password: generalRules.password.required(),
    age: Joi.number().required(),
    gender: Joi.string().valid("Male", "Female").required(),
    phone: Joi.string().required(),
    userType: Joi.string().valid("Buyer", "Admin").required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.number().required(),
    buildingNumber: Joi.number().required(),
    apartmentNumber: Joi.number().required(),
    addressLabel: Joi.string().required(),
  }),
};

// ==== Login schema ====
export const loginSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
    password: generalRules.password.required(),
  }),
};

// ==== Get profile schema ====
export const getProfileSchema = {
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};

// ==== update user schema ====
export const updateUserSchema = {
  body: Joi.object({
    userName: Joi.string().min(3).max(30).alphanum().optional(),
    email: generalRules.email.optional(),
    age: Joi.number().optional(),
    gender: Joi.string().valid("Male", "Female").optional(),
    phone: Joi.string().optional(),
    userType: Joi.string().valid("Buyer", "Admin").optional(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};

// ====Update password schema ====
export const updatePasswordSchema = {
  body: Joi.object({
    oldPassword: generalRules.password.required(),
    newPassword: generalRules.password.required(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};

// ==== Forget password schema ====
export const forgetPasswordSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
  }),
};

// ==== Reset password schema ====
export const resetPasswordSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
    otp: Joi.string().required(),
    password: generalRules.password.required(),
  }),
};

// ==== delete user schema ====
export const deleteUserSchema = {
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};
