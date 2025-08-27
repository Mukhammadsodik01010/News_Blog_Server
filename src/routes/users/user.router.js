const { Router } = require("express");
const UserController = require("../../controllers/users/users.controller");
const UserValidator = require("../../validators/users/users.validator");
const expressValidator = require("../../validators");
const AuthMiddleware = require("../../middlewares/auth.middleware");
const RoleMiddleware = require("../../middlewares/role.middleware");
const { RoleNames } = require("../../utils/constants");

const User_Router = Router();

User_Router.post(
  "/add-admins",
  UserValidator.SignUpAdmin(),
  expressValidator,
  UserController.SignUpAdmin
);

User_Router.post(
  "/add-users",
  UserValidator.SignUpUsers(),
  expressValidator,
  UserController.signUpUser
);

User_Router.post(
  "/sign-in",
  UserValidator.SignIn(),
  expressValidator,
  UserController.SignIN
);

User_Router.get("/get-me", AuthMiddleware, UserController.GetME)

User_Router.get("/get-all-users", UserValidator.GetAllUsers(), AuthMiddleware, RoleMiddleware(RoleNames.ADMIN), UserController.getAllUsers)

module.exports = User_Router;
