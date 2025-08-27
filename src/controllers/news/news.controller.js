const { StatusCodes } = require("http-status-codes");
const NewsModel = require("../../models/news/news.model");
const { CollectionNames } = require("../../utils/constants");
const HttpException = require("../../utils/http.exception");
const FileSchema = require("../../models/files/files.model");
const UserModel = require("../../models/users/users.model");

class NewsController {
  static GetAllNews = async (req, res) => {
    const { search, page = 1, limit = 10, user_id } = req.query;
    let query = {};
    if (search && search.length > 0) {
      query = {
        $or: [
          { title: { $regex: search.trim(), $options: "i" } },
          { desc: { $regex: search.trim(), $options: "i" } },
        ],
      };
    }
    if (user_id) {
      query.user = user_id;
    }

    const news = await NewsModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate(CollectionNames.USERS, "name email");

    const total = await NewsModel.countDocuments(query);

    res.status(200).json({
      success: true,
      data: news,
      pagination: {
        currentPage: Number(page),
        totalItems: total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
        hasNextPage: (page - 1) * limit + news.length < total,
        hasPrevPage: page > 1,
      },
    });
  };

  static GetById = async (req, res) => {
    const { id } = req.params;
    const news = await NewsModel.findById(id).populate([
      {
        path: "user",
        select: "name email",
      },
    ]);
    if (!news) {
      throw new HttpException(StatusCodes.NOT_FOUND, "News is not found");
    }
    res.status(200).json({ success: true, data: news });
  };

  static AddNews = async (req, res) => {
    const { title, desc, image } = req.body;
    const { user_id } = req.user;

    const existingNews = await NewsModel.findOne(title);
    if (existingNews) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "News with this title already exists"
      );
    }
    const save_file = await FileSchema.findOne({ file_path: image });
    if (!save_file) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "Image file is not found"
      );
    }
    if (save_file.is_use) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "Image file is in use: " + save_file.where_used
      );
    }

    const news = await NewsModel.create({
      title,
      desc,
      image,
      user: user_id,
    });
    res
      .status(StatusCodes.CREATED)
      .json({ success: true, msg: "News is crreated1" });

    const user = await UserModel.findById(user_id);
    user.news.push(news._id);
    await user.save();

    await save_file.updateOne({
      is_use: true,
      where_used: "news",
      user: user,
    });
  };

  static UpdateNews = async (req, res) => {
    const { id } = req.params;
    const { title, desc, image } = req.body;
    const { user_id } = req.user;

    const news = await NewsModel.findById(id);
    if (!news) {
      throw new HttpException(StatusCodes.NOT_FOUND, "News not found!");
    }

    if (news.user.toString() !== user_id) {
      throw new HttpException(
        StatusCodes.FORBIDDEN,
        "You are not allowed to update this news!"
      );
    }

    const updatedNews = {};

    if (image && image !== news.image) {
      const save_file = await FileSchema.findOne({ file_path: image });
      if (!save_file) {
        throw new HttpException(
          StatusCodes.BAD_REQUEST,
          "Image file not found!"
        );
      }
      if (save_file.is_use) {
        throw new HttpException(
          StatusCodes.BAD_REQUEST,
          "Image file is in use: " + save_file.where_used
        );
      }
      updatedNews.image = image;
    }
    if (title && title !== news.title) {
      const existingNews = await NewsModel.findOne({ title });
      if (existingNews) {
        throw new HttpException(
          StatusCodes.CONFLICT,
          "News with this title already exists!"
        );
      }
      updatedNews.title = title;
    }
    if (desc && desc !== news.desc) {
      updatedNews.desc = desc;
    }

    await NewsModel.findByIdAndUpdate(id, updatedNews);
    if (image && image !== news.image) {
      await FileSchema.updateOne(
        { file_path: news.image },
        { is_use: false, where_used: "" }
      );
      await FileSchema.updateOne(
        { file_path: image },
        { is_use: true, where_used: "news" }
      );

      res.status(200).json({ success: true, msg: "News updated!" });
    }
  };

  static DeleteNews = async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.user;

    const news = await NewsModel.findById(id);
    if (!news) {
      throw new HttpException(StatusCodes.NOT_FOUND, "News not found!");
    }

    if (news.user.toString() !== user_id) {
      throw new HttpException(
        StatusCodes.FORBIDDEN,
        "You are not allowed to delete this news!"
      );
    }

    // await NewsModel.findByIdAndDelete(id); // 1-st way
    await news.deleteOne(id); // 2-nd way
    await SaveFileModel.updateOne(
      { file_path: news.image },
      { is_use: false, where_used: "" }
    );
    await UserModel.findByIdAndUpdate(user_id, {
      $pull: { news: id },
    });

    res.status(200).json({ success: true, msg: "News deleted!" });
  };
}

module.exports = NewsController;
