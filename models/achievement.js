const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  game: String,
  achievement: String,
  progress: Number,
  image: String,     // ← RAWG game image
  genre: String,    // ← RAWG game genre
});

module.exports = mongoose.model("Achievement", achievementSchema);
