const { Router } = require("express");
const AuthMiddleware = require("../../middlewares/auth.middleware");
const { uploadFile } = require("../../utils/file.upload");
const UploadController = require("../../controllers/files/files.controller");

const Files_Router = Router()

Files_Router.post("/", AuthMiddleware, uploadFile.single("file"), UploadController.UplloadFile)

module.exports = Files_Router;