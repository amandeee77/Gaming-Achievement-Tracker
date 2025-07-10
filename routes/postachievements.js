const express = require("express");
const router = express.Router();
const Achievement = require("../models/achievement");
const fetchSteamAchievementDetails = require("../utils/fetchSteamAchievementDetails");

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
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving achievement:", err);
    res.status(500).json({ error: "Failed to save achievement." });
  }
});

router.get("/", async (req, res) => {
  try {
    const achievements = await Achievement.find();
    res.json(achievements);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch achievements." });
  }
});

module.exports = router;