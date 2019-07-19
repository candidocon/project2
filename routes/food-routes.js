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
  var img = "";
  if (req.file) {
    img = req.file.url;
  }
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
      if (foodInfo.owner === req.user._id) {
        foodInfo.isowner = true;
      }
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

router.get(
  "/food/:foodId/edit",
  ensureLogin.ensureLoggedIn(),
  (req, res, next) => {
    let foodId = req.params.foodId;
    Food.findById(foodId)
      .then(foodInfo => {
        if (foodInfo.owner.equals(req.user._id)) {
          Location.find()
            .then(allLocations => {
              allLocations.forEach(eachLocation => {
                if (eachLocation._id.equals(foodInfo.location)) {
                  eachLocation.selected = true;
                }
              });
              res.render("food-views/food-edit", {
                food: foodInfo,
                locations: allLocations
              });
            })
            .catch(err => {
              next(err);
            });
        }
      })
      .catch(err => {
        console.log(err);
        next(err);
      });
  }
);

router.post(
  "/food/:foodId/edit",
  uploadCloud.single("image"),
  (req, res, next) => {
    let foodId = req.params.foodId;
    if (req.file) {
      req.body.pic = req.file.url;
    }

    Food.findByIdAndUpdate(foodId, req.body)
      .then(foodInfo => {
        res.redirect("/food/" + foodId);
      })
      .catch(err => {
        console.log(err);
        next(err);
      });
  }
);

router.post("/food/:id/delete", (req, res, next) => {
  Food.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect("/profile");
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
