const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const Food = require("../models/Food");

router.get("/signup", (req, res, next) => {
  res.render("user-views/signup");
});

//TODO: login user once they sign up
router.post("/signup", (req, res, next) => {
  const thePassword = req.body.password;
  const theUsername = req.body.username;
  const email = req.body.email;

  const salt = bcrypt.genSaltSync(12);
  const hashedPassWord = bcrypt.hashSync(thePassword, salt);

  User.create({
    username: theUsername,
    password: hashedPassWord,
    email: email
  })
    .then(() => {
      console.log("yay");
      res.redirect("/");
    })
    .catch(err => {
      next(err);
    });
});

router.get("/login", (req, res, next) => {
  res.render("user-views/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/login");
});

router.get("/profile", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  let ownerId = req.user._id;
  Food.find({ owner: ownerId })
    .then(foodFromThisUser => {
      res.render("user-views/profile", { foods: foodFromThisUser });
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
