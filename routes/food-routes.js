const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const Food = require("../models/Food");
const Location = require("../models/Location");
const uploadCloud = require("../config/cloudinary.js");

router.get("/add-food", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Location.find()
    .then(allLocations => {
      res.render("food-views/add-food", { locations: allLocations });
    })
    .catch(err => {
      next(err);
    });
});

router.post("/add-food", uploadCloud.single("image"), (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const location = req.body.location;
  const img = req.file.url;
  // console.log(req.file.url);
  Food.create({
    name: name,
    description: description,
    pic: img,
    location: location,
    owner: req.user._id
  })
    .then(() => {
      console.log("yay");
      res.redirect("/");
    })
    .catch(err => {
      next(err);
    });
});

router.get("/food/:foodId", (req, res, next) => {
  let foodId = req.params.foodId;
  Food.findById(foodId)
    .then(foodInfo => {
      Location.findById(foodInfo.location)
        .then(oneLocation => {
          res.render("food-views/food-show", {
            food: foodInfo,
            location: oneLocation
          });
        })
        .catch(err => {
          next(err);
        });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
});

router.get("/food/:foodId/edit", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  let foodId = req.params.foodId;
  Food.findById(foodId)
    .then(foodInfo => {
      // if(/)
      Location.findById(foodInfo.location)
        .then(oneLocation => {
          res.render("food-views/food-show", {
            food: foodInfo,
            location: oneLocation
          });
        })
        .catch(err => {
          next(err);
        });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
});

module.exports = router;
