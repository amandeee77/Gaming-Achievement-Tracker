require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));

// 🧠 Authentication Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model("User", userSchema);

// 🛠 Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret: "yourSecretKey",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 3600000 }
}));

// 🧾 Authentication Routes
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views/signup.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views/login.html"));
});

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
  res.status(200).json({ success: true });
});

app.get("/", async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// 🎮 Achievements API (MongoDB + Steam enrichment)
const achievementRoutes = require("./routes/achievements");
app.use("/api/achievements", achievementRoutes);

// 🔍 Optional: Steam API test route
app.get("/api/steam", async (req, res) => {
  const { steamID, appID } = req.query;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const fetch = (await import("node-fetch")).default;
    const url = `https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v2/?appid=${appID}&key=${process.env.STEAM_API_KEY}&steamid=${steamID}`;
    const response = await fetch(url, { signal: controller.signal });

    clearTimeout(timeout);
    if (!response.ok) throw new Error(`Steam API error: ${response.status}`);
    const data = await response.json();
    res.json(data.playerstats);
  } catch (error) {
    console.error("Steam API error:", error);
    res.status(500).json({ error: "Failed to fetch Steam achievements." });
  }
});

// 🧯 Error handler
app.use((err, req, res, next) => {
  console.error("Unexpected server error:", err);
  res.status(500).send("Something broke!");
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🌐 Server running at http://localhost:${PORT}`);
});