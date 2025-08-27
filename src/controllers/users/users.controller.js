const { StatusCodes } = require("http-status-codes");
const HttpException = require("../../utils/http.exception");
const { REG_KEY, JWT_SECRET } = require("../../utils/secrets");
const UserModel = require("../../models/users/users.model");
const { hash, genSalt, compare } = require("bcryptjs");
const { RoleNames } = require("../../utils/constants");
const jwt = require("jsonwebtoken");
const { json } = require("express");

class UserController {
  static SignUpAdmin = async (req, res) => {
    const { reg_key, name, email, password } = req.body;
    if (reg_key !== REG_KEY) {
      throw new HttpException(
        StatusCodes.FORBIDDEN,
        "Invalid registration key"
      );
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new HttpException(
        StatusCodes.CONFLICT,
        "Email is already registered"
      );
    }

    const Salt = await genSalt(10);
    const HashedPassword = await hash(password, Salt);

    await UserModel.create({
      name,
      email,
      password: HashedPassword,
      role: RoleNames.ADMIN,
    });
    res
      .status(StatusCodes.CREATED)
      .json({ Success: true, msg: "Admin is created" });
  };

  static signUpUser = async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new HttpException(
        StatusCodes.CONFLICT,
        "Email is already registered"
      );
    }

    const Salt = await genSalt(10);
    const HashedPassword = await hash(password, Salt);

    await UserModel.create({
      name,
      email,
      password: HashedPassword,
    });
    res
      .status(StatusCodes.CREATED)
      .json({ Success: true, msg: "User is created" });
  };

  static SignIN = async (req, res) => {
    const { email, password } = req.body;

    const User = await UserModel.findOne({ email });
    if (!User) {
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        "Invalid email or password"
      );
    }

    const isMatch = await compare(password, User.password);
    if (!isMatch) {
      throw new HttpException(
        StatusCodes.UNAUTHORIZED,
        "Invalid email or password"
      );
    }

    const token = jwt.sign({ user_id: User._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(StatusCodes.OK).json({ success: true, token });
  };

  static GetME = async (req, res) => {
    const user = await UserModel.findById(req.user.user_id).select("-password");
    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, "User is not found");
    }
    res.status(StatusCodes.OK).json({ success: true, data: user });
  };

  static getAllUsers = async (req, res) => {
    const { search = "", page = 1, limit = 10 } = req.query;

    const query = {};

    if (search && search.length > 0) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await UserModel.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit);

    const totalUsers = await UserModel.countDocuments(query);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: users,
      pagination: {
        currentPage: Number(page),
        totalItems: totalUsers,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalUsers / limit),
        hasNextPage: (page - 1) * limit + users.length < totalUsers,
        hasPrevPage: page > 1,
      },
    });
  };
}

module.exports = UserController;
