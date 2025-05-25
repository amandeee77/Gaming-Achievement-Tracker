document.getElementById("achievementForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const game = document.getElementById("game").value;
    const achievement = document.getElementById("achievement").value;
    const progress = document.getElementById("progress").value;

    if (!game || !achievement || progress === "") {
        alert("All fields must be filled!");
        return;
    }

    const response = await fetch("http://localhost:3000/api/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game, achievement, progress })
    });

    const data = await response.json();
    displayAchievement(data); // Ensure new achievement is displayed in the list
});

async function fetchAchievements() {
    const response = await fetch("http://localhost:3000/api/achievements");
    const data = await response.json();
    document.getElementById("achievementList").innerHTML = "";
    data.forEach(displayAchievement);
}

function displayAchievement(achievement) {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${achievement.game}</strong>: ${achievement.achievement} - <b>${achievement.progress}% Complete</b>`;
    document.getElementById("achievementList").appendChild(li);
}

fetchAchievements();

const gameImages = {
    "Dreamlight Valley": "dreamlight_valley.jpg",
    "Minecraft": "minecraft.jpg",
    "Overwatch": "overwatch.jpg",
    "The Sims 4": "sims.jpg"
};

function displayAchievement(achievement) {
    const li = document.createElement("li");
    
    // Use game image if available, otherwise default
    const gameImage = gameImages[achievement.game] || "default.jpg";

    li.innerHTML = `
        <img src="images/${gameImage}" alt="${achievement.game}" width="100">
        <strong>${achievement.game}</strong>: ${achievement.achievement} - <b>${achievement.progress}% Complete</b>
    `;
    
    document.getElementById("achievementList").appendChild(li);
}