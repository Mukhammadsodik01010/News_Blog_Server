const { StatusCodes } = require("http-status-codes");
const HttpException = require("../../utils/http.exception");
const { v4 } = require("uuid");
const path = require("path");
const { uploadFIleS3, deleteFileS3 } = require("../../utils/s3");
const FileSchema = require("../../models/files/files.model");

class UploadController {
    static UplloadFile = async (req, res) => {
      
    const uploadedFile = req.file;
    if (!uploadedFile) {
      throw new HttpException(StatusCodes.CONFLICT, "File not provided");
    }
    let file_name = v4() + path.extname(uploadedFile.originalname);

    if (uploadedFile.mimetype.startsWith("image/")) {
      file_name = "images/" + v4() + path.extname(uploadedFile.originalname);
    }

    if (uploadedFile.mimetype.startsWith("video/")) {
      file_name = "videos/" + v4() + path.extname(uploadedFile.originalname);
    }

    const file_path = await uploadFIleS3(file_name, uploadedFile.buffer);

    await FileSchema.create({
      file_path,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      file_path,
    });
  };

  static deleteFile = async (req, res) => {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const files = await FileSchema.find(
        {
          is_use: false,
          created_at: { $lt: oneDayAgo },
        },
        null,
        { lean: true }
      ).map((file) => file.file_path);
        
        for (const file of files) {
            await deleteFileS3(file)
            await FileSchema.deleteOne({file_path:file})
        }

        return files.length.toString();
    } catch (error) {
      console.error(error);
      return "Not";
    }
  };
}

module.exports = UploadController;
