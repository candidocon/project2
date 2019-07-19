const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const Food = require("../models/Food");
const uploadCloud = require("../config/cloudinary.js");

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
    email: email,
    pic: "/images/default-user-image.png"
  })
    .then(() => {
      console.log("yay");
      res.redirect("/profile");
    })
    .catch(err => {
      next(err);
    });
});

router.get("/login", (req, res, next) => {
  res.render("user-views/login");
});

// router.post(
//   "/login",
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     // successRedirect: "/profile",
//     failureFlash: true,
//     passReqToCallback: true
//   }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     console.log("=====lololol===");
//     console.log(req.body.latitude);
//     req.session.latitude = req.body.latitude;
//     req.session.longitude = req.body.longitude;
//     // console.log(req.user.latitude);
//     res.redirect("/profile");
//   }
// );

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
  req.session.destroy();
  req.logout();
  res.redirect("/login");
});

router.get("/profile", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  let ownerId = req.user._id;
  console.log("FFFFFFFFF:");
  console.log(req.session.latitude);
  console.log(req.session.longitude);
  Food.find({ owner: ownerId })
    .then(foodFromThisUser => {
      res.render("user-views/profile", { foods: foodFromThisUser });
    })
    .catch(err => {
      next(err);
    });
});

router.get("/profile/edit", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("user-views/profile-edit");
});

router.post("/profile/edit", uploadCloud.single("image"), (req, res, next) => {
  if (req.file) {
    req.body.pic = req.file.url;
  }
  User.findByIdAndUpdate(req.user._id, req.body)
    .then(user => {
      res.redirect("/profile");
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
});

router.get(
  "/profile/:userId",
  ensureLogin.ensureLoggedIn(),
  (req, res, next) => {
    let userId = req.params.userId;
    User.findById(userId)
      .then(userInfo => {
        Food.find({ owner: userId })
          .then(foodFromThisUser => {
            res.render("user-views/profile-others", {
              thisUser: userInfo,
              foods: foodFromThisUser
            });
          })
          .catch(err => {
            next(err);
          });
      })
      .catch(err => {
        next(err);
      });
  }
);

module.exports = router;
