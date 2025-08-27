const { Schema, model } = require("mongoose");
const { RoleNames, CollectionNames } = require("../../utils/constants");

const dacumentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [RoleNames.USER, RoleNames.ADMIN],
      default: RoleNames.USER,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserModel = model(CollectionNames.USERS, dacumentSchema, CollectionNames.USERS);

module.exports = UserModel;
