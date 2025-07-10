const fetch = require("node-fetch");

async function fetchSteamAchievementDetails(appid, achievementName) {
  const url = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${process.env.STEAM_API_KEY}&appid=${appid}`;
  const res = await fetch(url);
  const schema = await res.json();

  const achievements = schema?.game?.availableGameStats?.achievements;
  if (!achievements) return null;

  return achievements.find(a => a.name === achievementName) || null;
}

module.exports = fetchSteamAchievementDetails;