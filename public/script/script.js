// Fetch game info from RAWG via backend proxy
// This avoids CORS issues and keeps API key secure
async function searchGame(title) {
  try {
    const response = await fetch(`/api/rawg-search?title=${encodeURIComponent(title)}`);
    if (!response.ok) throw new Error("RAWG fetch failed");
    const game = await response.json();

    if (!game || !game.name) {
      console.warn("RAWG returned no match");
      return {
        background_image: "/images/default.jpg",
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

// Handle Achievement Form Submission
// This function collects form data, fetches game info, and submits the achievement
// It also handles validation and error reporting
document.getElementById("achievementForm").addEventListener("submit", async (e) => {
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
    image: gameData.background_image || "/images/default.jpg",
    genre: gameData.genres?.[0]?.name || "Unknown"
  };

  try {
    const res = await fetch("/api/achievements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry)
    });

    if (!res.ok) throw new Error("Failed to save achievement");

    document.getElementById("achievementForm").reset();
    await fetchRecentAchievements();
  } catch (error) {
    console.error("Error submitting achievement:", error);
  }
});

// Render Achievement Entry
// This function creates a list item for each achievement entry
// It includes the game cover, achievement details, progress bar, and delete button
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

// Delete Achievement
// This function sends a DELETE request to remove an achievement by ID
async function deleteAchievement(id) {
  try {
    const res = await fetch(`/api/achievements/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
    await fetchRecentAchievements();
  } catch (error) {
    console.error("Error deleting achievement:", error);
  }
}

// Load Recent Achievements
// This function fetches the latest achievements from the server
async function fetchRecentAchievements() {
  try {
    const res = await fetch("/api/achievements");
    if (!res.ok) throw new Error("Failed to fetch achievements");

    const data = await res.json();
    const list = document.getElementById("achievementList");
    list.innerHTML = "";

    data.forEach(renderAchievement);
  } catch (error) {
    console.error("Error loading achievements:", error);
  }
}

// Display Static Welcome Message
function displayWelcomeMessage() {
  const banner = document.getElementById("welcomeBanner");
  banner.innerHTML = `
    <h2>Welcome, Guest 👋</h2>
    <p>Your achievement journey awaits—let’s level up!</p>
  `;
}

// Initialize on Page Load
window.addEventListener("DOMContentLoaded", () => {
  console.log("🎮 Achievement Tracker Loaded");
  displayWelcomeMessage();
  fetchRecentAchievements();
});