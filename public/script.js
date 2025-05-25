document.getElementById("achievementForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const game = document.getElementById("game").value.trim();
    const achievement = document.getElementById("achievement").value.trim();
    const progress = parseInt(document.getElementById("progress").value, 10);

    if (!game || !achievement || isNaN(progress) || progress < 0 || progress > 100) {
        alert("Please enter valid game details and progress (0-100%).");
        return;
    }

    const response = await fetch("http://localhost:3000/api/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game, achievement, progress })
    });

    if (response.ok) {
        fetchAchievements(); // Refresh achievements after adding
    } else {
        alert("Error adding achievement. Please try again.");
    }
});

async function fetchAchievements() {
    const response = await fetch("http://localhost:3000/api/achievements");
    const data = await response.json();
    document.getElementById("achievementList").innerHTML = "";
    data.forEach(displayAchievement);
}

// Game images mapped to file paths
const gameImages = {
    "Dreamlight Valley": "dreamlight_valley.jpg",
    "Minecraft": "minecraft.jpg",
    "Overwatch": "overwatch.jpg",
    "The Sims 4": "sims.jpg"
};

function displayAchievement(achievement) {
    const li = document.createElement("li");
    const gameImage = gameImages[achievement.game] || "default.jpg";

    li.innerHTML = `
        <img src="images/${gameImage}" alt="${achievement.game}" width="100">
        <strong>${achievement.game}</strong>: ${achievement.achievement} - <b>${achievement.progress}% Complete</b>
    `;

    document.getElementById("achievementList").appendChild(li);
}

fetchAchievements();