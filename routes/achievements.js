const express = require("express");
const router = express.Router();
const Achievement = require("../models/achievement");

// POST: Add new achievement with RAWG enrichment from frontend
// This route allows users to submit a new achievement entry.
router.post("/", async (req, res) => {
  const { game, achievement, progress, image, genre } = req.body;
  const userId = req.session.userId; 

  try {
    const newAchievement = new Achievement({
      game,
      achievement,
      progress,
      image,
      genre,
      userId
    });

    const saved = await newAchievement.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error saving achievement:", err);
    res.status(500).json({ error: "Failed to save achievement." });
  }
});

// GET: Retrieve all achievements
// This route fetches the most recent achievements for the logged-in user.
router.get("/", async (req, res) => {
  const userId = req.session.userId;

  try {
    const achievements = await Achievement.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(achievements);
  } catch (err) {
    console.error("❌ Error fetching achievements:", err);
    res.status(500).json({ error: "Failed to fetch achievements." });
  }
});


// GET: Retrieve achievements by game
// This route allows users to filter achievements by a specific game.
module.exports = router;