const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV;
const REG_KEY = process.env.REG_KEY;
const JWT_SECRET = process.env.JWT_SECRET;
const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_URL = process.env.AWS_URL;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

module.exports = {
  PORT,
  MONGODB_URI,
  NODE_ENV,
  REG_KEY,
  JWT_SECRET,
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_URL,
  AWS_BUCKET_NAME,
};
