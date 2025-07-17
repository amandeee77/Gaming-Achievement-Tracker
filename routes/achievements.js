const express = require("express");
const router = express.Router();
const Achievement = require("../models/achievement");

// Automatically fetch cover image and genre from RAWG API
const fetch = require("node-fetch");



// POST: Add new achievement with RAWG enrichment (server-side)
router.post("/", async (req, res) => {
  const { game, achievement, progress } = req.body;
  const userId = req.session.userId;

  let image = "";
  let genre = "";

  try {
    const apiKey = process.env.RAWG_API_KEY;
    const url = `https://api.rawg.io/api/games?search=${encodeURIComponent(game)}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    const match = data.results?.[0];
    if (match) {
      image = match.background_image || "";
      genre = match.genres?.[0]?.name || "";
    }
  } catch (err) {
    console.error("❌ RAWG enrichment failed:", err);
  }

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

// GET: Retrieve recent achievements for the user
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

router.delete("/:id", async (req, res) => {
  const userId = req.session.userId;
  const achievementId = req.params.id;

  try {
    const deleted = await Achievement.findOneAndDelete({ _id: achievementId, userId });
    if (!deleted) return res.status(404).json({ error: "Achievement not found." });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Error deleting achievement:", err);
    res.status(500).json({ error: "Failed to delete achievement." });
  }
});

module.exports = router;