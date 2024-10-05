import { ErrorClassHandler } from "../utils/error-class.utils.js";

export const getDocumentByName = (model) => {
  return async (req, res, next) => {
    const { name } = req.body;
    if (name) {
      const document = await model.findOne({ name });
      if (document) {
        return next(
          new ErrorClassHandler(
            " this name already exists",
            400,
            " this name already exists"
          )
        );
      }
    }
    next();
  };
};

// check ids
export const checkIfIdsExsit = (model) => {
  return async (req, res, next) => {
    const { category, subCategory, brand } = req.query;
    // ids check
    const document = await model
      .findOne({
        _id: brand,
        categoryId: category,
        subCategoryId: subCategory,
      })
      .populate([
        { path: "categoryId", select: "customId" },
        { path: "subCategoryId", select: "customId" },
      ]);
    if (!document)
      return next(
        new ErrorClassHandler(`${model.modelName} is not found`, {
          status: 404,
        })
      );
    req.document = document;
    next();
  };
};
