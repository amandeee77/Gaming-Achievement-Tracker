const express = require("express");
const router = express.Router();
const Achievement = require("../models/achievement");
const fetchSteamAchievementDetails = require("../utils/fetchSteamAchievementDetails");

// POST: Add new achievement with optional Steam enrichment
router.post("/", async (req, res) => {
  const { game, achievement, progress, appid } = req.body;

  try {
    let details = null;
    if (appid) {
      details = await fetchSteamAchievementDetails(appid, achievement);
    }

    const newAchievement = new Achievement({
      game,
      achievement,
      progress,
      appid,
      details
    });

    const saved = await newAchievement.save();
    console.log("Saved new achievement:", saved); // 🪵 Log new entry
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving achievement:", err);
    res.status(500).json({ error: "Failed to save achievement." });
  }
});

// GET: Retrieve all achievements
router.get("/", async (req, res) => {
  try {
    const achievements = await Achievement.find();
    console.log("Achievements sent to frontend:", achievements); // 🪵 Log results
    res.json(achievements);
  } catch (err) {
    console.error("Error fetching achievements:", err);
    res.status(500).json({ error: "Failed to fetch achievements." });
  }
});

module.exports = router;