document.getElementById("achievementForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const game = document.getElementById("game").value.trim();
    const achievement = document.getElementById("achievement").value.trim();
    const progress = parseInt(document.getElementById("progress").value, 10);

    if (!game || !achievement || isNaN(progress) || progress < 0 || progress > 100) {
        alert("Please enter valid game details and progress (0-100%).");
        return;
    }
//Input validation for game, achievement, and progress
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
        displayAchievement(newAchievement);
        fetchAchievements();
        
        // Clears the form fields
        document.getElementById("achievementForm").reset();

    } catch (error) {
        console.error("Error adding achievement:", error);
        alert(error.message);
    }
});
// Displays achievements and handles form submission for adding new achievements
async function fetchAchievements() {
    try {
        const response = await fetch("http://localhost:3000/api/achievements");

        if (!response.ok) {
            throw new Error("Failed to fetch achievements.");
        }

        const data = await response.json();
        document.getElementById("achievementList").innerHTML = ""; // Clear before updating
        data.forEach(displayAchievement);
// DIsplays each achievment (https://javascript.info/try-catch)
    } catch (error) {
        console.error("Error fetching achievements:", error);
    }
}
// used AI to help with code completion. Specifically, to handle the display of achievements and manage the game images dynamically.
// 🎮 Game images mapped to file paths
const gameImages = {
    "Dreamlight Valley": "images/dreamlight_valley.jpg",
    "Minecraft": "images/minecraft.jpg",
    "Overwatch": "images/overwatch.jpg",
    "The Sims 4": "images/sims.jpg"
};

function displayAchievement(achievement) {
    if (!achievement || !achievement.game || !achievement.achievement) return;

    const li = document.createElement("li");
    const gameImage = gameImages[achievement.game] || "images/gaming.jpg";  

    li.innerHTML = `
        <img src="${gameImage}" alt="${achievement.game}" width="100">
        <strong>${achievement.game}</strong>: ${achievement.achievement} - <b>${achievement.progress}% Complete</b>
    `;

    document.getElementById("achievementList").appendChild(li);
}

// Load achievements on page load
fetchAchievements();