const { body, param } = require("express-validator");

class NewsValidator {
  static add = () => [
    body("title", "Title is required.").notEmpty(),
    body("title", "Title must be a string.").isString(),
    body("desc", "Desc is required.").notEmpty(),
    body("desc", "Desc must be a string.").isString(),
    body("image", "Image is required.").notEmpty(),
    body("image", "Image must be a string.").isURL(),
  ];

  static getById = () => [
    param("id", "ID must be a valid MongoDB ObjectId.").isMongoId(),
  ];

  static update = () => [
    param("id", "ID must be a valid MongoDB ObjectId.").isMongoId(),
    body("title", "Title must be a string.").optional().isString(),
    body("desc", "Desc must be a string.").optional().isString(),
    body("image", "Image must be a valid URL.").optional().isURL(),
  ];
}

module.exports = { NewsValidator };
