const { Router } = require("express");
const NewsController = require("../../controllers/news/news.controller");
const AuthMiddleware = require("../../middlewares/auth.middleware");
const { NewsValidator } = require("../../validators/news/news.validator");
const expressValidator = require("../../validators");

const News_Router = Router();

News_Router.get("/get-all-news", NewsController.GetAllNews);

News_Router.get(
  "/get-by-id/:id",
  NewsValidator.getById(),
  expressValidator,
  NewsController.GetById
);
News_Router.post(
  "/add-news",
  AuthMiddleware,
  NewsValidator.add(),
  expressValidator,
  NewsController.AddNews
);
News_Router.put(
  "/update-news/:id",
  AuthMiddleware,
  NewsValidator.update(),
  expressValidator,
  NewsController.UpdateNews
);
News_Router.delete(
  "/delete-news/:id",
  AuthMiddleware,
  NewsValidator.getById(),
  expressValidator,
  NewsController.DeleteNews
);

module.exports = News_Router;
