document.getElementById("achievementForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const game = document.getElementById("game").value.trim();
    const achievement = document.getElementById("achievement").value.trim();
    const progress = parseInt(document.getElementById("progress").value, 10);

    if (!game || !achievement || isNaN(progress) || progress < 0 || progress > 100) {
        alert("Please enter valid game details and progress (0-100%).");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/achievements", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ game, achievement, progress })
        });

        if (!response.ok) {
            throw new Error("Failed to add achievement.");
        }

        const newAchievement = await response.json();  
        displayAchievement(newAchievement); // Show new achievement immediately
        fetchAchievements(); // Ensure the full list refreshes
        
        // Clear form fields for fresh input
        document.getElementById("achievementForm").reset();

    } catch (error) {
        console.error("Error adding achievement:", error);
        alert(error.message);
    }
});

async function fetchAchievements() {
    try {
        const response = await fetch("http://localhost:3000/api/achievements");

        if (!response.ok) {
            throw new Error("Failed to fetch achievements.");
        }

        const data = await response.json();
        document.getElementById("achievementList").innerHTML = ""; // Clear before updating
        data.forEach(displayAchievement);

    } catch (error) {
        console.error("Error fetching achievements:", error);
    }
}
// Game images mapping

function displayAchievement(achievement) {
  if (!achievement || !achievement.game || !achievement.achievement) return;

  const li = document.createElement("li");
  const gameImage = gameImages[achievement.game] || "images/gaming.jpg";

  li.innerHTML = `
    <img src="${gameImage}" alt="${achievement.game}" width="100">
    <strong>${achievement.game}</strong>: ${achievement.achievement} - <b>${achievement.progress}% Complete</b>

    <div class="progress-container">
      <div class="progress-bar" style="width: ${achievement.progress}%;">
        ${achievement.progress}%
      </div>
    </div>
  `;

  document.getElementById("achievementList").appendChild(li);
}

// Load achievements on page load
fetchAchievements();
