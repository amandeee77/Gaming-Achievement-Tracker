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

// 🧠 User Schema
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

// 👤 Provide session-based user info
app.get("/api/user", (req, res) => {
  if (req.session.userId) {
    res.json({ name: req.session.userName });
  } else {
    res.json({ name: null });
  }
});

// 🎮 Achievements API (RAWG-enriched backend)
const achievementRoutes = require("./routes/achievements");
app.use("/api/achievements", achievementRoutes);

// 🔎 Proxy RAWG API request to avoid CORS
app.get("/api/rawg-search", async (req, res) => {
  const title = req.query.title;
  const apiKey = process.env.RAWG_API_KEY;

  try {
    const fetch = (await import("node-fetch")).default;
    const url = `https://api.rawg.io/api/games?search=${encodeURIComponent(title)}&key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`RAWG API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data.results[0] || {}); // Send first match or empty if no result
  } catch (err) {
    console.error("❌ RAWG API fetch error:", err);
    res.status(500).json({ error: "Failed to fetch game data from RAWG." });
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