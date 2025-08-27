const { Schema, model } = require("mongoose");
const { CollectionNames } = require("../../utils/constants");

const dacumentSchema = new Schema(
  {
    file_path: {
      type: String,
      required: true,
    },
    is_use: {
      type: Boolean,
      required: true,
      default: false,
    },
    where_used: {
      type: String,
      enum: ["news"],
    },
    user: {
      type: Object,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

const FileSchema = model(
  CollectionNames.SAVE_FILE,
  dacumentSchema,
  CollectionNames.SAVE_FILE
);

module.exports = FileSchema;
