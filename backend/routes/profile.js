var express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const Users = require("../models/UserModel");
const { uploadFile, getFileStream } = require("../s3");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

router.get("/", (req, res) => {
  let msg = {};
  msg.route = "getUserProfile";
  msg.email = req.query.email;
  kafka.make_request("profile", msg, function (err, result) {
    if (result) {
      res.send(result);
    }
  });
});

router.put("/", (req, res) => {
  let msg = {};
  msg.route = "updateProfile";
  msg.email = req.body.email;
  msg.name = req.body.name;
  msg.phone = req.body.phone;
  msg.timezone = req.body.timezone;
  msg.currency = req.body.currency;
  msg.language = req.body.language;
  kafka.make_request("profile", msg, function (err, result) {
    if (result) {
      res.send(result);
    }
  });
});

router.post("/image", upload.single("image"), async (req, res) => {
  const file = req.file;
  const id = req.body.id;
  console.log("ID ", id);
  console.log("File info", file);
  const result = await uploadFile(file);
  await unlinkFile(file.path);
  console.log("Image upload Result ", result);
  Users.findOne({ _id: id }, (err, user) => {
    if (user) {
      user.image = result.key;
      user.save();
    }
    res.send("success");
  });
});

router.get("/image", (req, res) => {
  console.log(req.query.image);
  const key = req.query.image;
  const readStream = getFileStream(key);
  readStream.pipe(res);
});

module.exports = router;
