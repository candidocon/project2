const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const Food = require("../models/Food");
const Location = require("../models/Location");

router.get("/add-food", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Location.find()
    .then(allLocations => {
      res.render("food-views/add-food", { locations: allLocations });
    })
    .catch(err => {
      next(err);
    });
});

router.post("/add-food", (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const location = req.body.location;

  Food.create({
    name: name,
    description: description,
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

router.get("/location/:locationId", (req, res, next) => {
  let locationId = req.params.locationId;
  Location.findById(locationId)
    .then(oneLocation => {
      Food.find({ location: locationId })
        .then(foodInThisLocation => {
          res.render("location-views/location-show", {
            location: oneLocation,
            foods: foodInThisLocation
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
