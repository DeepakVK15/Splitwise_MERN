const Users = require("../models/UserModel");
var express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  Users.findOne(
    { email: req.body.email, password: req.body.password },
    (error, user) => {
      if (error) {
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });
        console.log("Error occured");
        res.end("Error Occured");
      }
      if (user) {
        res.cookie("cookie", user.email, {
          maxAge: 900000,
          httpOnly: false,
          path: "/",
        });
        req.session.user = user;
        res.send({ message: "login success" });
      } else {
        res.send({ message: "Incorrect username or password." });
      }
    }
  );
});

module.exports = router;
