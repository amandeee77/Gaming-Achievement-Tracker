const express = require("express");
const router = express.Router();
const Achievement = require("../models/achievement");

// POST: Add new achievement with RAWG enrichment from frontend
router.post("/", async (req, res) => {
  const { game, achievement, progress, image, genre } = req.body;
  const userId = req.session.userId; // ← from logged-in session

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



module.exports = router;