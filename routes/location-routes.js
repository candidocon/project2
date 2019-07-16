const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const Location = require("../models/Location");
const Food = require("../models/Food");
const uploadCloud = require("../config/cloudinary.js");

router.get("/all-locations", (req, res, next) => {
  Location.find()
    .then(allLocations => {
      res.render("location-views/all-locations", { locations: allLocations });
    })
    .catch(err => {
      next(err);
    });
});

router.get("/add-location", (req, res, next) => {
  res.render("location-views/add-location");
});

router.post("/add-location", uploadCloud.single("image"), (req, res, next) => {
  const name = req.body.name;
  const streetAddress = req.body.streetAddress;
  const city = req.body.city;
  const state = req.body.state;
  const zipCode = req.body.zipCode;
  const img = req.file.url;
  const status = "open";
  Location.create({
    name: name,
    streetAddress: streetAddress,
    city: city,
    state: state,
    zipCode: zipCode,
    // country: country,
    status: status,
    pic: img
  })
    .then(() => {
      console.log("yay");
      res.redirect("/");
    })
    .catch(err => {
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
