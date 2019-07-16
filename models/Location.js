const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  name: { type: String },
  streetAddress: { type: String },
  city: { type: String },
  state: { type: String }, // possible enum with all states
  zipCode: { type: Number }, // possible enum with all states
  // country: { type: String },
  food: [{ type: Schema.Types.ObjectId, ref: "Food" }],
  status: { type: String, enum: ["open", "shutdown"] }
});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
