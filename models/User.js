const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, unique: true },
  password: { type: String },
  email: { type: String },
  userType: { type: String, enum: ["regular", "modderator"] },
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  rating: { type: Number },
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  favoriteFood: [{ type: Schema.Types.ObjectId, ref: "Food" }],
  pic: { type: String }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
