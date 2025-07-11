const express = require("express");
const router = express.Router();
const Achievement = require("../models/achievement");

// POST: Add new achievement with RAWG enrichment from frontend
router.post("/", async (req, res) => {
  const { game, achievement, progress, image, genre } = req.body;

  try {
    const newAchievement = new Achievement({
      game,
      achievement,
      progress,
      image,
      genre
    });

    const saved = await newAchievement.save();
    console.log("✅ Saved new achievement:", saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error saving achievement:", err);
    res.status(500).json({ error: "Failed to save achievement." });
  }
});

// GET: Retrieve all achievements
router.get("/", async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ _id: -1 });
    console.log("📦 Sent achievements to frontend:", achievements);
    res.json(achievements);
  } catch (err) {
    console.error("❌ Error fetching achievements:", err);
    res.status(500).json({ error: "Failed to fetch achievements." });
  }
});

module.exports = router;