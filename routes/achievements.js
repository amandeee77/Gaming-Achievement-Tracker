const express = require("express");
const router = express.Router();
const Achievement = require("../models/achievement");

//  GET: Fetch all achievements (public access)
router.get("/", async (req, res) => {
  console.log("📡 GET /api/achievements hit");

  try {
    const achievements = await Achievement.find().sort({ createdAt: -1 });
    res.status(200).json(achievements);
  } catch (err) {
    console.error("💥 Error fetching achievements:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//  POST: Save a new achievement (guest mode)
router.post("/", async (req, res) => {
  console.log("📨 POST /api/achievements hit");
  console.log("📦 Body:", req.body);

  try {
    const newAchievement = new Achievement({
      ...req.body
    });
    const saved = await newAchievement.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("💥 Error saving achievement:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//  DELETE: Remove achievement by ID
router.delete("/:id", async (req, res) => {
  console.log("🗑️ DELETE /api/achievements/", req.params.id);

  try {
    const deleted = await Achievement.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Achievement not found" });
    }
    res.status(200).json({ message: "Achievement deleted" });
  } catch (err) {
    console.error("💥 Error deleting achievement:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = router;