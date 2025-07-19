const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    game: { type: String, required: true },
    achievement: { type: String, required: true },
    progress: { type: Number, required: true },
    image: { type: String, default: "" }, // RAWG image URL
    genre: { type: String, default: "Unknown" }
  },
  { timestamps: true } // includes createdAt & updatedAt
);

module.exports = mongoose.model("Achievement", achievementSchema);
