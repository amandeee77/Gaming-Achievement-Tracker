const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware (Load First)
app.use(cors());
app.use(bodyParser.json());

// Serve Static Files
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html")); // Serve HTML page
});

let achievements = [];

// Load saved achievements from JSON file
try {
    achievements = JSON.parse(fs.readFileSync("achievements.json", "utf8"));
} catch (err) {
    achievements = []; // Default to empty array if file doesn't exist
}

// GET achievements
app.get("/api/achievements", (req, res) => {
    res.json(achievements);
});

// POST (Add New Achievement & Save)
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

// Start Server (Only Once)
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});