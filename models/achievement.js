// Gaming-Achievement-Tracker/models/achievement.js
// This file defines the Mongoose schema for achievements
const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    game: { type: String, required: true },
    achievement: { type: String, required: true },
    progress: { type: Number, required: true },
    image: { type: String, default: "" }, 
    genre: { type: String, default: "Unknown" }
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Achievement", achievementSchema);
