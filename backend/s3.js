const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
const {
  aws_bucket_name,
  aws_bucket_region,
  aws_access_key,
  aws_secret_key,
} = require("./config");

const bucketName = aws_bucket_name;
const region = aws_bucket_region;
const accessKeyId = aws_access_key;
const secretAccessKey = aws_secret_key;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// uploads a file to s3
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: aws_bucket_name,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
}
exports.uploadFile = uploadFile;

// downloads a file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
}

exports.getFileStream = getFileStream;
