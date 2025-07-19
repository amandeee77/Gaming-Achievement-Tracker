// Load environment variables
require("dotenv").config();

// Import modules
const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const achievementRoutes = require("./routes/achievements");

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3001;
const RAWG_API_KEY = process.env.RAWG_API_KEY;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serves HTML/CSS/JS

// Achievement Routes (guest access)
app.use("/api/achievements", achievementRoutes);

// RAWG API Proxy
// This endpoint fetches game data from RAWG API
app.get("/api/rawg-search", async (req, res) => {
  const title = req.query.title;
  try {
    const url = `https://api.rawg.io/api/games?search=${encodeURIComponent(title)}&key=${RAWG_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`RAWG API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data.results[0] || {});
  } catch (err) {
    console.error("❌ RAWG API fetch error:", err);
    res.status(500).json({ error: "Failed to fetch game data from RAWG." });
  }
});

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).send("🚫 Route not found");
});

app.use((err, req, res, next) => {
  console.error("💥 Unexpected server error:", err);
  res.status(500).send("Something broke!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🌐 Server running at http://localhost:${PORT}`);
});