const { body, query } = require("express-validator");

class UserValidator {
  static SignUpAdmin = () => [
    body("name", "Name is required.").notEmpty(),
    body("name", "Name must be a string.").isString(),
    body("email", "Email is required.").notEmpty(),
    body("email", "Email must be a valid email address.").isEmail(),
    body("password", "Password is required.").notEmpty(),
    body(
      "password",
      "Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number, and no special characters."
    ).isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    }),
    body("reg_key", "Registration key is required.").notEmpty(),
    body("reg_key", "Registration key must be a string.").isString(),
  ];

  static SignUpUsers = () => [
    body("name", "Name is required.").notEmpty(),
    body("name", "Name must be a string.").isString(),
    body("email", "Email is required.").notEmpty(),
    body("email", "Email must be a valid email address.").isEmail(),
    body("password", "Password is required.").notEmpty(),
    body(
      "password",
      "Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number, and no special characters."
    ).isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    }),
  ];

  static SignIn = () => [
    body("email", "Email is required.").notEmpty(),
    body("email", "Email must be a valid email address.").isEmail(),
    body("password", "Password is required.").notEmpty(),
    body("password", "Password must be at least 8 characters long.").isLength({
      min: 8,
    }),
  ];

  static GetAllUsers = () => [
    query("search", "Search query must be a string.").optional().isString(),
    query("page", "Page must be a number.").optional().isNumeric(),
    query("limit", "Limit must be a number.").optional().isNumeric(),
  ];
}

module.exports = UserValidator;
