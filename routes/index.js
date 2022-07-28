const express = require("express"),
    Project = require("../models/project"),
    Announcement = require("../models/announcement"),
    User = require("../models/user"),
    passport = require("passport"),
    i18n = require("i18n"),
    router = express.Router();

router.get("/", (req, res) => {
    Announcement.find({}).exec((err, announcements) => {
        let username = "Admin";
        User.findOne({ username: username })
          .populate("achievements")
          .exec(function (err, user) {
            let header = "Home | Websites With Passion";
            i18n.setLocale(req.language);
            res.render("index", {
              currentUser: req.user,
              announcements: announcements,
              user: user,
              header: header,
              home: "",
            });
          });
    })
               
                   
               
           
});

router.get("/login", (req, res) => {
    let header = "Logowanie | Websites With Passion";
   res.render("login", {header: header});
});

router.get("/colorgame", function(req, res){
    let header = `Zgadywanie kolorów | Bootcamp | Websites With Passion`;
	res.render("color", { header: header  });
});

router.get("/score-keeper", function(req, res){
    let header = `Score keeper | Bootcamp | Websites With Passion`;
	res.render("score", { header: header });
})


router.post("/login", (req, res, next) =>  {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { 
           req.flash("error", "Zła nazwa użytkownika lub hasło");
            return res.redirect(`/login?return_route=${req.query.return_route}`); 
          }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.redirect(req.query.return_route);
        });
      })(req, res, next);
});

router.get("/support", (req, res) => {
	res.redirect("https://www.buymeacoffee.com/crazydev");
});

router.get("/register", (req, res) => {
    i18n.setLocale(req.language);
    res.render("register");
});
router.post("/register", (req, res) => {
    let newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            req.flash("error", err.message)
            return res.render("register", {user: req.body, error: err.message});
        } 
        passport.authenticate("local")(req, res, function() {
            req.flash("success", i18n.__('Witaj ') + req.body.username + i18n.__(' na moim portfolio'));
            res.redirect("/login");
        });
    });
});

router.get("/logout", (req, res) =>  {
    req.logout();
    res.redirect("/");
});

module.exports = router;