const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema({
  game: String,
  achievement: String,
  progress: Number,
  appid: Number,
  details: {
    name: String,
    displayName: String,
    description: String,
    icon: String,
    icongray: String
  }
});

module.exports = mongoose.model("Achievement", AchievementSchema);