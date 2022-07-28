const express = require("express"),
    User = require("../models/user"),
    cors = require("cors"),
    router = express.Router();


router.get("/user", cors(), (req, res) => {
    let username = "Admin";
    User.findOne({username: username}).populate("achievements").exec(function(err, user){
        if(err){
            console.log(err);
        } else {
           res.json(user);
        }
    });
})


module.exports = router;