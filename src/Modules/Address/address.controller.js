// models
import { User, Address } from "../../../DB/models/index.js";
// utils
import { ErrorClassHandler } from "../../utils/index.js";

// ======================= add address =======================
/**
 * @api { post } /users/addAddress Add a new address for the user
 */
export const addAddress = async (req, res, next) => {
  // destructuring the Date
  const userId = req.authUser._id;
  const {
    country,
    city,
    postalCode,
    buildingNumber,
    apartmentNumber,
    addressLabel,
    setAsDefault,
  } = req.body;

  const newAddress = new Address({
    userId,
    country,
    city,
    postalCode,
    buildingNumber,
    apartmentNumber,
    addressLabel,
    isDefault: [true, false].includes(setAsDefault) ? setAsDefault : false,
  });
  // If setAsDefault is true, reset all other addresses' isDefault to false
  if (newAddress.isDefault) {
    await Address.updateOne({ userId, isDefault: true }, { isDefault: false });
  }

  const address = await newAddress.save();

  return res.status(201).json({
    status: "success",
    message: "Address added successfully",
    data: address,
  });
};

// ======================= Update address =======================
/**
 * @api { put } /addresses/update/:_id  Update address by id
 */
export const updateAddress = async (req, res, next) => {
  // destructuring the Date
  const {
    country,
    city,
    postalCode,
    buildingNumber,
    apartmentNumber,
    addressLabel,
    setAsDefault,
  } = req.body;
  const { _id } = req.authUser;
  const { addressId } = req.params;

  const address = await Address.findOne({
    _id: addressId,
    userId: _id,
    isMarkedAsDeleted: false,
  });
  // check if address exists
  if (!address) {
    return next(
      new ErrorClassHandler("Address not found", 404, "Address not found")
    );
  }

  if (country) address.country = country;
  if (city) address.city = city;
  if (postalCode) address.postalCode = postalCode;
  if (buildingNumber) address.buildingNumber = buildingNumber;
  if (apartmentNumber) address.apartmentNumber = apartmentNumber;
  if (addressLabel) address.addressLabel = addressLabel;
  if ([true, false].includes(setAsDefault)) {
    address.isDefault = [true, false].includes(setAsDefault)
      ? setAsDefault
      : false;
    await Address.updateOne(
      { userId: _id, isDefault: true },
      { isDefault: false }
    );
  }

  await address.save();
  res.status(200).json({
    status: "success",
    message: "Address updated successfully",
    data: address,
  });
};

// ======================= Delete address =======================
/**
 * @api { delete } /addresses/delete/:_id  Delete address
 */
export const deleteAddress = async (req, res, next) => {
  // destructuring the Date
  const { _id } = req.authUser;
  const { addressId } = req.params;
  // find the address and update it
  const address = await Address.findOneAndUpdate(
    {
      _id: addressId,
      userId: _id,
      isMarkedAsDeleted: false,
    },
    { isMarkedAsDeleted: true, isDefault: false },
    { new: true }
  );

  // check if address exists
  if (!address) {
    return next(
      new ErrorClassHandler("Address not found", 404, "Address not found")
    );
  }
  // send the response
  res.status(200).json({
    status: "success",
    message: "Address deleted successfully",
  });
};

// ======================= Get address =======================
/**
 * @api { get } /addresses/list  get all address
 */
export const getAddresses = async (req, res, next) => {
  const { _id } = req.authUser;
  const addresses = await Address.find({
    userId: _id,
    isMarkedAsDeleted: false,
  });
  res.status(200).json({
    status: "success",
    message: "Addresses retrieved successfully",
    data: addresses,
  });
};
