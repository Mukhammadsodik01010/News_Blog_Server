const { StatusCodes } = require("http-status-codes");
const UserModel = require("../models/users/users.model");
const HttpException = require("../utils/http.exception");

const RoleMiddleware = (role) => {
  return async (req, res, next) => {
    const { user_id } = req.user;

    const user = await UserModel.findById(user_id);
    if (!user) {
      throw new HttpException(
        StatusCodes.NOT_FOUND,
        "User is not found in role middleware"
      );
    }
    if (!role.includes(user.role)) {
      throw new HttpException(
        StatusCodes.FORBIDDEN,
        "You do not have access to perform this action"
      );
    }
    next();
  };
};

module.exports = RoleMiddleware;
