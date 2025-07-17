// loads environment variables from .env file
require("dotenv").config();

//import necessary modules
const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const RAWG_API_KEY = process.env.RAWG_API_KEY;



// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));

// User Schema
// This schema is used for user authentication
// It includes email and password fields, with email being unique.
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model("User", userSchema);

// Middleware
// CORS and body parsing middleware
// This allows cross-origin requests and parses JSON and URL-encoded bodies.
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
// Session management
// This sets up session management using MongoDB to store session data.
app.use(session({
  secret: "yourSecretKey",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 3600000 }
}));

// Authentication Routes
// These routes handle user registration and login.
// They use bcrypt for password hashing and session management for user sessions.
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views/signup.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views/login.html"));
});
// User registration
// This route allows users to register by providing an email and password.
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: "Email already registered." });

  const hash = await bcrypt.hash(password, 12);
  const user = new User({ email, password: hash });
  await user.save();
  res.status(200).json({ success: true });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Email not found." });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid password." });

  req.session.userId = user._id;
  req.session.userName = user.email;
  res.status(200).json({ success: true });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// Provide session-based user info
// This route returns the current user's name if logged in, or null if not.
app.get("/api/user", (req, res) => {
  if (req.session.userId) {
    res.json({ name: req.session.userName });
  } else {
    res.json({ name: null });
  }
});

// Achievements API (RAWG-enriched backend)
// This module handles all achievement-related routes and logic.
// It includes routes for fetching achievements, adding new ones, and updating existing ones.
const achievementRoutes = require("./routes/achievements");
app.use("/api/achievements", achievementRoutes);

// Proxy RAWG API request to avoid CORS
// This route allows the frontend to search for games using the RAWG API.
app.get("/api/rawg-search", async (req, res) => {
  const title = req.query.title;
  try {
    const fetch = (await import("node-fetch")).default;
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



// Error handler
// Handle 404 for unknown routes
app.use((req, res) => {
  res.status(404).send("🚫 Route not found");
});

// Global error handler
// This middleware catches any errors that occur in the app and sends a generic error response.
app.use((err, req, res, next) => {
  console.error("Unexpected server error:", err);
  res.status(500).send("Something broke!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🌐 Server running at http://localhost:${PORT}`);
});