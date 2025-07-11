const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  game: { type: String, required: true },
  achievement: { type: String, required: true },
  progress: { type: Number, required: true },
  image: String,
  genre: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model("Achievement", achievementSchema);
