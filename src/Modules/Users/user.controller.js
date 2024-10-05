import jwt from "jsonwebtoken";
import { hashSync, compareSync } from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import { DateTime } from "luxon";
// models
import { User, Address } from "../../../DB/models/index.js";
// utils
import { ErrorClassHandler } from "../../utils/index.js";
import { sendEmailService } from "../../Services/send-email.service.js";

// ================= add user =================
/**
 * @api { post } /users/register add new user
 */
export const signUp = async (req, res, next) => {
  const {
    userName,
    password,
    email,
    gender,
    age,
    phone,
    userType,
    country,
    city,
    postalCode,
    buildingNumber,
    apartmentNumber,
    addressLabel,
  } = req.body;
  // check if user already exists
  const user = await User.findOne({
    $or: [{ email }, { phone }],
  });
  if (user) {
    return next(
      new ErrorClassHandler("User already exists", 400, "User already exists")
    );
  }
  // create new user
  const newUserInstance = new User({
    userName,
    password,
    email,
    gender,
    age,
    phone,
    userType,
  });
  // create new address
  const addressInstance = new Address({
    userId: newUserInstance._id,
    country,
    city,
    postalCode,
    buildingNumber,
    apartmentNumber,
    addressLabel,
    isDefault: true,
  });
  // generate token for Confirmation Email
  const token = jwt.sign(
    { user: newUserInstance },
    process.env.CONFIRMATION_TOKEN_FOR_EMAIL,
    {
      expiresIn: "1h",
    }
  );
  // generate email confirmation link
  const confirmationLink = `${req.protocol}://${req.headers.host}/users/verify-email/${token}`;
  // sending email
  const isEmailSent = sendEmailService({
    to: email,
    subject: "Welcome to E-Commerce Website",
    htmlMessage: `<h1><a href=${confirmationLink}>Please verify your account</a></h1>`,
  });
  // check if email sent
  if (isEmailSent?.rejected?.length)
    return next(
      new ErrorClassHandler("Email Failed sending", 500, "Email Failed sending")
    );

  // save address to database
  const newAdress = await addressInstance.save();
  // save user to database
  const newUser = await newUserInstance.save();
  // send the response
  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: newUser,
    newAdress,
  });
};

// ================= verify Email =================
export const verifyEmail = async (req, res, next) => {
  const { token } = req.params;
  const data = jwt.verify(token, process.env.CONFIRMATION_TOKEN_FOR_EMAIL);

  const confirmedUser = await User.findOneAndUpdate(
    { _id: data?.user._id, isEmailVerified: false },
    { isEmailVerified: true },
    { new: true }
  );
  if (!confirmedUser)
    return next(
      new ErrorClassHandler("User not confirmed", 404, "User not confirmed")
    );
  res
    .status(200)
    .json({ message: "User verified successfully", confirmedUser });
};

// ================= login =================
/**
 * @api { post } /users/login authenticate a user
 */

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    $and: [{ email }, { isEmailVerified: true }],
  });
  if (!user) {
    return next(
      new ErrorClassHandler("Invalid credentials", 404, "Invalid credentials")
    );
  }
  const isMatch = compareSync(password, user.password);
  if (!isMatch) {
    return next(
      new ErrorClassHandler("Invalid credentials", 401, "Invalid credentials")
    );
  }
  // Generate user token
  const token = jwt.sign(
    { userId: user?._id, email: user?.email },
    process.env.LOGIN_SECRET,
    { expiresIn: "1h" }
  );

  user.status = "online";
  await user.save();
  res.json({
    status: "Success",
    message: "User logged in successfully",
    token,
  });
};

// ================= Login with google =================
/**
 * @api { post } /users/loginWithGmail authenticate a user
 */
export const loginWithGmail = async (req, res, next) => {
  const { idToken } = req.body;
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return payload;
  }
  const result = await verify().catch(console.error);

  if (!result.email_verified) {
    return next(
      new ErrorClassHandler("Email not verified", 401, "Email not verified")
    );
  }

  const user = await User.findOne({ email: result.email, provider: "GOOGLE" });
  if (!user) {
    return next(
      new ErrorClassHandler("Invalid credentials", 404, "Invalid credentials")
    );
  }
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.LOGIN_SECRET,
    { expiresIn: "1h" }
  );
  user.isLoggedIn = true;
  await user.save();
  res.status(200).json({ message: "Login success", result: result, token });
};

// ================= Signup with google =================
/**
 * @api { post } /users/signUpWithGmail authenticate a user
 */
export const signUpWithGmail = async (req, res, next) => {
  const { idToken } = req.body;
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return payload;
  }
  const result = await verify().catch(console.error);
  if (!result.email_verified) {
    return next(
      new ErrorClassHandler("Email not verified", 401, "Email not verified")
    );
  }

  // check if user already exists
  const user = await User.findOne({ email: result.email });
  if (user) {
    return next(
      new ErrorClassHandler("Email already exists", 400, "Email already exists")
    );
  }
  // generate random password
  const randomPassword = Math.random().toString(36).slice(-8);

  // create new user
  const newUserInstance = new User({
    userName: result.name,
    email: result.email,
    password: bcrypt.hashSync(randomPassword, +process.env.SALT_ROUNDS),
    phone: "01019019570",
    provider: "GOOGLE",
  });

  // save user
  const newUser = await newUserInstance.save();
  // send the response
  res.status(201).json({
    status: "success",
    message: "User created",
    user: newUser,
  });
};

// ================= Get profile user =================
/**
 * @api { get } /users/profile  - get user profile
 */
export const getProfile = async (req, res, next) => {
  const { _id } = req.authUser;
  // get user information
  const user = await User.findById(_id).select("-password -_id");
  res.status(200).json({ user });
};

// ================= Update user =================
/**
 * @api { put } /users/update  - update user profile
 */
export const updateUser = async (req, res, next) => {
  // destructuring data
  const { _id } = req.authUser;
  const { email, userName, userType, gender, phone, age } = req.body;
  //  check if email already exists
  if (email) {
    const isEmailAndPhoneExist = await User.findOne({ email });
    if (isEmailAndPhoneExist) {
      return next(
        new ErrorClassHandler(
          "Email already exists",
          400,
          "Email already exists"
        )
      );
    }
    const findUser = await User.findByIdAndUpdate(
      _id,
      {
        isEmailVerified: false,
      },
      { new: true }
    );
    // generate token
    const token = jwt.sign(
      { user: findUser },
      process.env.CONFIRMATION_TOKEN_FOR_EMAIL,
      {
        expiresIn: "1h",
      }
    );
    // confirmation link
    const confirmationLink = `${req.protocol}://${req.headers.host}/users/verify-email/${token}`;
    // sending email
    const isEmailSent = await sendEmailService({
      to: email,
      subject: "welcome",
      htmlMessage: `<a href=${confirmationLink}>please verify your account</a>`,
    });
    if (isEmailSent.rejected.length) {
      return next(
        ErrorClassHandler("Email Failed sending", 500, "Email Failed sending")
      );
    }
  }
  // find user and update
  const user = await User.findByIdAndUpdate(
    _id,
    {
      email,
      userName,
      userType,
      gender,
      phone,
      age,
    },
    { new: true }
  );

  // send the response
  res.status(200).json({ message: "User updated ", user });
};

// ================= Update password =================
/**
 * @api { put } /users/update-password  - update user password
 */
export const updatePassword = async (req, res, next) => {
  // destruct data
  const { _id } = req.authUser;
  const { oldPassword, newPassword } = req.body;
  // find user
  const user = await User.findById(_id);
  // check user if not exist
  if (!user)
    return next(new ErrorClassHandler("User not found", 404, "User not found"));
  // check old password
  if (!compareSync(oldPassword, user.password))
    return next(
      new ErrorClassHandler(
        "Invalid current password",
        400,
        "Invalid current password"
      )
    );
  // Hash the new password
  const hashedPassword = hashSync(newPassword, +process.env.SALT_ROUND);
  // Update the user's password
  user.password = hashedPassword;
  await user.save();
  res.status(200).json({ message: "Password updated successfully" });
};

// ================= Forget password =================
/**
 * @api { post } /users/forget-password  - forget user password
 */
export const forgetPassword = async (req, res, next) => {
  // destruct data
  const { email } = req.body;
  // find user by email
  const user = await User.findOne({
    $and: [{ email }, { isEmailVerified: true }],
  });
  // check if email exist
  if (!user)
    return next(
      new ErrorClassHandler("Email doesn't exist", 404, "Email doesn't exist")
    );
  // generate random password
  const otp = otpGenerator.generate(17, {
    digits: true,
    alphabets: true,
    upperCase: true,
    specialChars: true,
  });

  user.otp = otp;

  // send new password to email
  const isEmailSent = sendEmailService({
    to: email,
    subject: "The new Password",
    htmlMessage: `<h1> Your password reset is: ${otp} </h1>`,
  });
  // check if email sent
  if (isEmailSent?.rejected?.length)
    return next(
      new ErrorClassHandler("Failed sending new password to your email", 500)
    );

  await User.updateOne({ email }, { otp: otp });
  res
    .status(200)
    .json({ status: "Success", message: "new Password sent your email" });
};
// ================= Reset password =================
/**
 * @api { put } /users/reset-password  - reset user password
 */
export const resetPassword = async (req, res, next) => {
  // destruct data
  const { email, otp, password } = req.body;
  // find user by email
  const user = await User.findOne({
    $and: [{ email }, { isEmailVerified: true }],
  });
  // check if email exist
  if (!user)
    return next(
      new ErrorClassHandler("Email doesn't exist", 404, "Email doesn't exist")
    );
  // check if otp not correct
  if (user.otp !== otp)
    return next(new ErrorClassHandler("otp is wrong", 400, "otp is wrong"));
  // hash new password
  const hash = hashSync(password, +process.env.SALT_ROUND);
  // change password
  await User.updateOne(
    { email },
    { password: hash, otp: "", passwordChangeAt: DateTime.now() }
  );
  // response
  res
    .status(200)
    .json({ status: "Success", message: "Password changed successfully" });
};

// ================= delete user =================
/**
 * @api { delete } /users/delete  - delete user profile
 */

export const deleteUser = async (req, res, next) => {
  const { _id } = req.authUser;
  const user = await User.findByIdAndUpdate(
    _id,
    { isMarkedAsDeleted: true },
    { new: true }
  );
  res.status(200).json({ status: "Success", message: "User deleted", user });
};
