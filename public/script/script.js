// 🔍 Fetch game info from RAWG.io
async function searchGame(title) {
  const apiKey = "YOUR_RAWG_API_KEY"; // Replace with your actual API key
  const response = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(title)}&key=${apiKey}`);
  const data = await response.json();
  return data.results[0]; // Take the first match
}

// 📝 Submit Achievement Entry
document.getElementById("achievementForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const game = document.getElementById("game").value;
  const achievement = document.getElementById("achievement").value;
  const progress = parseInt(document.getElementById("progress").value);

  const gameData = await searchGame(game);

  const entry = {
    game,
    achievement,
    progress,
    image: gameData?.background_image || "", // Safeguard if image missing
    genre: gameData?.genres?.[0]?.name || "Unknown"
  };

  try {
    await fetch("/api/achievements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry)
    });

    renderAchievement(entry); // Update list visually
  } catch (error) {
    console.error("Failed to submit achievement:", error);
  }
});

// 🎨 Render Achievement with Visual Flair
function renderAchievement(entry) {
  const li = document.createElement("li");
  li.className = "achievement-entry";

  li.innerHTML = `
    <img src="${entry.image}" alt="${entry.game}" class="game-cover" />
    <h3>${entry.game} - ${entry.achievement}</h3>
    <p>Genre: ${entry.genre}</p>
    <div class="progress-container">
      <div class="progress-bar" style="width: ${entry.progress}%">
        ${entry.progress}%
      </div>
    </div>
  `;

  document.getElementById("achievementList").appendChild(li);
}