const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test route
app.get("/", (req, res) => {
    res.send("Gaming Achievement Tracker API is running!");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

let achievements = []; // Store achievements in memory for now

// GET achievements
app.get("/api/achievements", (req, res) => {
    res.json(achievements);
});

// POST (Add new achievement)
app.post("/api/achievements", (req, res) => {
    const { game, achievement, progress } = req.body;
    if (!game || !achievement || progress === undefined) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const newAchievement = { id: achievements.length + 1, game, achievement, progress };
    achievements.push(newAchievement);
    res.json(newAchievement);
});

const fs = require("fs");

// Load saved achievements
try {
    achievements = JSON.parse(fs.readFileSync("achievements.json", "utf8"));
} catch (err) {
    achievements = [];
}

// Save achievements after adding a new one
app.post("/api/achievements", (req, res) => {
    const { game, achievement, progress } = req.body;
    if (!game || !achievement || progress === undefined) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const newAchievement = { id: achievements.length + 1, game, achievement, progress };
    achievements.push(newAchievement);
    fs.writeFileSync("achievements.json", JSON.stringify(achievements, null, 2));

    res.json(newAchievement);
});
// Load achievements from file on server start
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));