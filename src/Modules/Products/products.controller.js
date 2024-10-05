import slugify from "slugify";
import { nanoid } from "nanoid";
// models
import { Product } from "../../../DB/models/index.js";
// utils
import {
  ApiFeature,
  calculateProductPrice,
  cloudinaryConfig,
  ErrorClassHandler,
  ReviewStatus,
  uploadFile,
  getIo,
} from "../../utils/index.js";

// ======================= Add Product =======================
/**
 * @api {post} /product/add  Add Product
 */
export const addProduct = async (req, res, next) => {
  // destructuring the request body
  const { title, overview, specs, price, discountAmount, discountType, stock } =
    req.body;
  // req.files
  if (!req.files.length)
    return next(new ErrorClassHandler("No Images Uploaded", { status: 400 }));
  // Ids check
  const brandDocument = req.document;
  // Images section
  const brandCustomId = brandDocument.customId;
  const catgeoryCustomId = brandDocument.categoryId.customId;
  const subCategoryCustomId = brandDocument.subCategoryId.customId;

  const customId = nanoid(4);
  const folder = `${process.env.UPLOADS_FOLDER}/Categories/${catgeoryCustomId}/SubCategories/${subCategoryCustomId}/Brands/${brandCustomId}/Products/${customId}`;

  // upload each file to cloudinary
  const URLs = [];
  for (const file of req.files) {
    const { secure_url, public_id } = await uploadFile({
      file: file.path,
      folder,
    });
    URLs.push({ secure_url, public_id });
  }

  const productObject = {
    title,
    overview,
    specs: JSON.parse(specs),
    price,
    appliedDiscount: {
      amount: discountAmount,
      type: discountType,
    },
    stock,
    Images: {
      URLs,
      customId,
    },
    categoryId: brandDocument.categoryId._id,
    subCategoryId: brandDocument.subCategoryId._id,
    brandId: brandDocument._id,
  };
  // create in db
  const newProduct = await Product.create(productObject);
  //socket io
  getIo().emit("newProduct", { message: "new product created" });
  // send the response
  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: newProduct,
  });
};

// ======================= Update Product =======================
/**
 * @api {put} /product/update/:productId  Update Product
 */
export const updateProduct = async (req, res, next) => {
  console.log("heloo");
  // Product Id from params
  const { productId } = req.params;
  // destructuring the request body
  const {
    title,
    overview,
    specs,
    price,
    discountAmount,
    discountType,
    stock,
    badge,
    public_id,
  } = req.body;
  // find product from db
  const product = await Product.findById(productId)
    .populate("categoryId")
    .populate("subCategoryId")
    .populate("brandId");
  if (!product) {
    return next(new ErrorClassHandler("Product not found", { status: 404 }));
  }

  if (title) {
    product.title = title;
    product.slug = slugify(title, { replacement: "-", lower: true });
  }
  if (overview) product.overview = overview;
  if (specs) product.specs = specs;
  if (badge) product.badge = badge;
  if (stock) product.stock = stock;
  // update product price
  if (price || discountAmount || discountType) {
    const newPrice = price || product.price;
    const discount = {};
    discount.amount = discountAmount || product.appliedDiscount.amount;
    discount.type = discountType || product.appliedDiscount.type;

    product.appliedPrice = calculateProductPrice(newPrice, discount);
    product.price = newPrice;
    product.appliedDiscount = discount;
  }

  // Update Image
  if (req.file && public_id) {
    const urls = product.Images.URLs;
    const index = urls.findIndex((url) => url.public_id === public_id);
    const splitedPublicId = urls[index].public_id.split(
      `${product.Images.customId}/`
    )[1];
    console.log(splitedPublicId);
    const { secure_url } = await uploadFile({
      file: req.file.path,
      folder: `${process.env.UPLOADS_FOLDER}/Categories/${product.categoryId.customId}/SubCategories/${product.subCategoryId.customId}/Brands/${product.brandId.customId}/Products/${product.Images.customId}`,
      publicId: splitedPublicId,
    });
    product.Images.URLs[index].secure_url = secure_url;
  }

  // update in db
  await product.save();
  // send the response
  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: product,
  });
};

// ======================= List Products =======================
/**
 * @api {get} /products/list  list all Products
 *
 */

export const listProducts = async (req, res, next) => {
  const list = new ApiFeature(Product, req.query, [
    { path: "Reviews", match: { reviewStatus: ReviewStatus.ACCEPTED } },
  ])
    .filters()
    .sort()
    .pagination();
  const products = await list.mongooseQuery;
  res.status(200).json({
    status: "success",
    message: "Products list",
    data: products,
  });
};

// ======================= Get Product By Id =======================
/**
 * @api {get} /products/get/:productId get product by id
 *
 */
export const getProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findById(productId)
    .populate("categoryId")
    .populate("subCategoryId")
    .populate("brandId");
  if (!product) {
    return next(
      new ErrorClassHandler("product not found", 404, "product not found")
    );
  }
  res.status(200).json({
    status: "success",
    message: "product found",
    data: product,
  });
};

// ======================= Delete Product By Id =======================
/**
 * @api {delete} /products/delete/:productId  Delete Product
 */
export const deleteProduct = async (req, res, next) => {
  // destructuring the id from params
  const { id } = req.params;
  // delete the product from db
  const product = await Product.findByIdAndDelete(id)
    .populate("categoryId")
    .populate("subCategoryId")
    .populate("brandId");
  if (!product) {
    return next(
      new ErrorClassHandler("Product not found", 404, "Product not found")
    );
  }
  const productPath = `${process.env.UPLOADS_FOLDER}/Categories/${product.categoryId.customId}/SubCategories/${product.subCategoryId.customId}/Brands/${product.brandId.customId}/Products/${product.Images.customId}`;

  await cloudinaryConfig().api.delete_resources_by_prefix(productPath);
  await cloudinaryConfig().api.delete_folder(productPath);
  res.status(200).json({
    status: "success",
    message: "product deleted successfully",
  });
};
