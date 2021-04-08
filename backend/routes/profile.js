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

router.post("/",(req, res) => {
console.log("Heey");
    Users.findOne({email:req.body.email}, (err, user) =>{
        if(user){
            user.email = req.body.email,
            user.name = req.body.name,
            user.phone = req.body.phone,
            user.timezone = req.body.timezone,
            user.language = req.body.language,
            user.currency = req.body.currency
            user.save();
        console.log("IN porfile");
            res.send("Profile updated successfully");
        }
    })
})

module.exports = router;