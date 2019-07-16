const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const foodSchema = new Schema({
  name: { type: String },
  description: { type: String },
  location: { type: Schema.Types.ObjectId, ref: "Location" }, //future geo lacation
  commments: [
    {
      owner: { type: Schema.Types.ObjectId, ref: "User" },
      commment: { type: String },
      rating: { type: Number }
    }
  ],
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number },
  pic: { type: String }
});

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;
