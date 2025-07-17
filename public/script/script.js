// Fetch game info from RAWG through backend proxy
// This function searches for a game by title and returns its details.
async function searchGame(title) {
  try {
    const response = await fetch(`/api/rawg-search?title=${encodeURIComponent(title)}`);
    if (!response.ok) throw new Error("RAWG fetch failed");
    const game = await response.json();

    if (!game || !game.name) {
      console.warn("RAWG returned no match");
      return {
        background_image: "/images/default.jpg", // fallback image
        genres: [{ name: "Unknown" }]
      };
    }

    return game;
  } catch (error) {
    console.error("Error fetching game info:", error);
    return {
      background_image: "/images/default.jpg",
      genres: [{ name: "Unknown" }]
    };
  }
}

// Submit Achievement Entry
document.getElementById("achievementForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const game = document.getElementById("game").value.trim();
  const achievement = document.getElementById("achievement").value.trim();
  const progress = parseInt(document.getElementById("progress").value);

  if (!game || !achievement || isNaN(progress)) {
    console.warn("Missing or invalid form input");
    return;
  }

  const gameData = await searchGame(game);

  const entry = {
    game,
    achievement,
    progress,
    image: gameData?.background_image || "/images/default.jpg",
    genre: gameData?.genres?.[0]?.name || "Unknown"
  };

  try {
    const response = await fetch("/api/achievements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry)
    });

    if (!response.ok) throw new Error("Failed to save achievement");

    document.getElementById("achievementForm").reset(); // ✅ Clear form after success
    await fetchRecentAchievements(); // ✅ Refresh achievements
  } catch (error) {
    console.error("Error submitting achievement:", error);
  }
});

// Render Achievement with Visual Flair
function renderAchievement(entry) {
  const li = document.createElement("li");
  li.className = "achievement-entry";

  li.innerHTML = `
    <div class="achievement-card">
      <img src="${entry.image}" alt="${entry.game} cover" class="game-cover" />
      <div class="achievement-info">
        <h3>${entry.game} - ${entry.achievement}</h3>
        <p>Genre: ${entry.genre}</p>
        <div class="progress-container">
          <div class="progress-bar" style="width: ${entry.progress}%;">
            ${entry.progress}%
          </div>
        </div>
        <button class="delete-btn" onclick="deleteAchievement('${entry._id}')">❌ Remove</button>
      </div>
    </div>
  `;

  document.getElementById("achievementList").appendChild(li);
}

// Delete Achievement Entry
async function deleteAchievement(id) {
  try {
    const response = await fetch(`/api/achievements/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Delete failed");

    await fetchRecentAchievements(); // Refresh display
  } catch (error) {
    console.error("Error deleting achievement:", error);
  }
}

// Fetch Recent Achievements
async function fetchRecentAchievements() {
  try {
    const response = await fetch("/api/achievements");
    if (!response.ok) throw new Error("Failed to fetch achievements");

    const data = await response.json();
    const list = document.getElementById("achievementList");
    list.innerHTML = "";

    data.forEach(renderAchievement);
  } catch (error) {
    console.error("Error loading recent achievements:", error);
  }
}

// Fetch user name and greet
async function displayWelcomeMessage() {
  try {
    const response = await fetch("/api/user");
    const data = await response.json();

    const banner = document.getElementById("welcomeBanner");

    banner.innerHTML = data.name
      ? `
        <h2>Welcome back, ${data.name} 🎉</h2>
        <p>Your achievement journey awaits—let’s level up!</p>
      `
      : `
        <h2>Welcome, Guest 👋</h2>
        <p>Feel free to explore or <a href="/login">log in</a> to start tracking your progress.</p>
      `;
  } catch (error) {
    console.error("Error loading welcome message:", error);
  }
}

// Initialize on Page Load
window.addEventListener("DOMContentLoaded", () => {
  console.log("🎮 Achievement Tracker Loaded");
  displayWelcomeMessage();
  fetchRecentAchievements();
});