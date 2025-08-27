const { Router } = require("express")
const News_Router = require("./news/news.router");
const User_Router = require("./users/user.router");
const Files_Router = require("./files/files.router");

const router = Router()

router.use("/files", Files_Router);
router.use("/news", News_Router)
router.use("/users", User_Router);

module.exports = router