const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const Food = require("../models/Food");
const Location = require("../models/Location");
const uploadCloud = require("../config/cloudinary.js");

var zomato = require("zomato-api");
var client = zomato({
  userKey: process.env.ZOMATO_KEY
});

router.get("/zomato", (req, res, next) => {
  console.log("sesslat: " + req.session.latitude);
  console.log("sesslon: " + req.session.longitude);
  if (req.session.latitude) req.session.latitude = 25.7661885;
  if (req.session.longitude) req.session.longitude = -80.19610279999999;

  client
    .getGeocode({
      lat: req.session.latitude,
      lon: req.session.longitude,
      count: 10
    })
    .then(response => {
      console.log("**********************");
      console.log(response);
      // console.log(response.nearby_restaurants[0].restaurant);
      res.render("zomato-views/zomato-restaurants", {
        restaurants: response.nearby_restaurants
      });
    })
    .catch(err => console.log(err));
});

router.get("/zomato/:restId", (req, res, next) => {
  restaurantId = req.params.restId;
  client
    .getRestaurant({
      res_id: restaurantId
    })
    .then(response => {
      console.log("=========================");
      console.log(response);
      res.render("zomato-views/zomato-location-show", {
        restaurant: response
      });
    })
    .catch(err => console.log(err));
});

module.exports = router;
