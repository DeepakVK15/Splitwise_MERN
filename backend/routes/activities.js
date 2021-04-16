var express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

router.get("/", (req, res) => {
    kafka.make_request(
        "activity",
        {
          email: req.query.email
        },
        function (err, result) {
            if(result)
            res.send(result);
        })
    });


module.exports = router;
