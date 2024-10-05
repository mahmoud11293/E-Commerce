import multer from "multer";
import fs from "fs";
import path from "path";
import { DateTime } from "luxon";
import { nanoid } from "nanoid";
import { ErrorClassHandler } from "../utils/error-class.utils.js";
import { extensions } from "../utils/extensions-File.utils.js";

export const multerMiddleware = ({
  filePath = "general",
  allowedExtensions,
} = {}) => {
  const destinationPath = path.resolve(`src/uploads/${filePath}`);

  if (!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath, { recursive: true });
  }
  // diskStorage: Multer will store the files in the disk storage.
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destinationPath);
    },
    // file name
    filename: (req, file, cb) => {
      // generate date
      const now = DateTime.now().toFormat("yyyy-MM-dd");
      // generate a unique string
      const uniqueString = nanoid(4);
      // generate a unique file name
      const uniqueFileName = `${now}_${uniqueString}_${file.originalname}`;
      cb(null, uniqueFileName);
    },
  });
  // file filter
  const fileFilter = (req, file, cb) => {
    if (allowedExtensions?.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(new ErrorClassHandler("Invalid file type", 400), false);
  };

  return multer({ fileFilter, storage }); // { fileFilter, storage, limits: {fields: 3, files: 2} }  ==> for limits using
};

// ========== Upload to Host ==========

export const multerHost = ({ allowedExtensions = extensions.Images }) => {
  const storage = multer.diskStorage({
    // file name
    filename: (req, file, cb) => {
      // generate date
      const now = DateTime.now().toFormat("yyyy-MM-dd");
      // generate a unique string
      const uniqueString = nanoid(4);
      // generate a unique file name
      const uniqueFileName = `${now}_${uniqueString}_${file.originalname}`;
      cb(null, uniqueFileName);
    },
  });

  // file filter
  const fileFilter = (req, file, cb) => {
    if (allowedExtensions?.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(new ErrorClassHandler("Invalid file type", 400), false);
  };

  return multer({ fileFilter, storage });
};
