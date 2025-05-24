document.getElementById("achievementForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const game = document.getElementById("game").value;
    const achievement = document.getElementById("achievement").value;
    const progress = document.getElementById("progress").value;

    const response = await fetch("http://localhost:3000/api/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game, achievement, progress })
    });

    const data = await response.json();
    displayAchievement(data);
});

async function fetchAchievements() {
    const response = await fetch("http://localhost:3000/api/achievements");
    const data = await response.json();
    document.getElementById("achievementList").innerHTML = "";
    data.forEach(displayAchievement);
}

function displayAchievement(achievement) {
    const li = document.createElement("li");
    li.textContent = `${achievement.game} - ${achievement.achievement} (${achievement.progress}%)`;
    document.getElementById("achievementList").appendChild(li);
}

fetchAchievements();

const cors = require("cors");
app.use(cors());