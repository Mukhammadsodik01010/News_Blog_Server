const { Schema, model } = require("mongoose");
const { CollectionNames } = require("../../utils/constants");

const dacumentSchema = new Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    image: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: CollectionNames.USERS },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const NewsModel = model(
  CollectionNames.NEWS,
  dacumentSchema,
  CollectionNames.NEWS
);

module.exports = NewsModel;
