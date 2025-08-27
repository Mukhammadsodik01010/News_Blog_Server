const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const {
  AWS_REGION,
  AWS_URL,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_NAME,
} = require("./secrets");

const s3Client = new S3Client({
  region: AWS_REGION,
  endpoint: AWS_URL,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

const uploadFIleS3 = async (key, buffer) => {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: AWS_BUCKET_NAME,
      Key: `Blog/${key}`,
      Body: buffer,
    },
  });

  try {
    const data = await upload.done();  // shu yerda await ishlatmaganm uchun ishlamadi
    if (data.$metadata.httpStatusCode === 200) {
      return data.Location;
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

const deleteFileS3 = async (location) => {
  try {
    if (location) {
      const key = location.split("s3.twcstorage.ru/")[1];

      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: AWS_BUCKET_NAME,
          Key: `Blog/${key}`,
        })
      );
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

module.exports = { uploadFIleS3, deleteFileS3 };
