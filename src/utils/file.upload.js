const multer = require("multer");
const path = require("path");
const HttpException = require("./http.exception");

const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|mp4|avi|mov/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(
      new HttpException(
        400,
        "Error: File upload only supports the following filetypes - " +
          filetypes
      )
    );
  }

};

const uploadFile = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

module.exports = { uploadFile };
