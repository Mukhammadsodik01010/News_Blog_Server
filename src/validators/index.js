const { validationResult } = require("express-validator");
const HttpException = require("../utils/http.exception");
const { StatusCodes } = require("http-status-codes");

const expressValidator = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  let message = "";

  errors.array().map((err) => {
    message += err.msg + " ";
  });
    throw new HttpException(StatusCodes.UNPROCESSABLE_ENTITY, message.trim())
};

module.exports = expressValidator;
