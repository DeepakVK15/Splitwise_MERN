var express = require("express");
const router = express.Router();
const Users = require("../models/UserModel");

router.get("/",(req, res) => {
    Users.find({ email: req.query.email }, (error, user) => {
        if(user){
            res.send(user);
        }
    })
})

module.exports = router;