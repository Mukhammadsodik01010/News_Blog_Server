const { ReasonPhrases, StatusCodes } = require("http-status-codes")

const errorMiddleware = (error, req, res, next) => {
    const msg = error.msg || error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    const status_code = error.status_code || StatusCodes.INTERNAL_SERVER_ERROR

    res.status(status_code).json({success:false, msg})
    next()
}

module.exports = errorMiddleware;