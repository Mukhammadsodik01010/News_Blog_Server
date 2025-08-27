const { StatusCodes } = require("http-status-codes");
const HttpException = require("../utils/http.exception");
const {verify} = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/secrets");

const AuthMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        throw new HttpException(StatusCodes.FORBIDDEN, "Token is not provided")
    }
    const decode = verify(token, JWT_SECRET)

    req.user = { user_id: decode.user_id }
    next()
};
module.exports = AuthMiddleware;
