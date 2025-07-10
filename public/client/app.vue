<template>
  <div id="app">
    <h1>🎯 Gaming Achievement Tracker</h1>

    <!-- Form to add new achievement -->
    <form @submit.prevent="addAchievement">
      <div class="form-group">
        <input v-model="appid" type="number" placeholder="Steam App ID (optional)" />
      </div>
      <div class="form-group">
        <input v-model="game" type="text" placeholder="Game Name" required />
      </div>
      <div class="form-group">
        <input v-model="achievement" type="text" placeholder="Achievement Name" required />
      </div>
      <div class="form-group">
        <input v-model.number="progress" type="number" placeholder="Progress %" required />
      </div>
      <button type="submit">Add Achievement</button>
    </form>

    <!-- Conditional Achievement Section -->
    <div>
      <div v-if="loading">Loading achievements...</div>
      <div v-else-if="error">{{ error }}</div>
      <ul v-else>
        <li v-for="a in achievements" :key="a.id">
          <!-- Steam Header Image -->
          <img
            v-if="a.appid"
            :src="`https://cdn.cloudflare.steamstatic.com/steam/apps/${a.appid}/header.jpg`"
            :alt="a.game"
            width="460"
            height="215"
          />

          <!-- Game Info -->
          <strong>{{ a.game }}</strong>: {{ a.achievement }} —
          <b>{{ a.progress }}% Complete</b>

          <!-- Achievement Details -->
          <div v-if="a.details">
            <h4>{{ a.details.displayName }}</h4>
            <p>{{ a.details.description }}</p>
            <img :src="a.details.icon" :alt="a.details.displayName" width="64" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      achievements: [],
      appid: null,
      game: "",
      achievement: "",
      progress: null,
      loading: true,
      error: null
    };
  },
  methods: {
    async fetchAchievements() {
      try {
        const response = await fetch("/api/achievements");
        if (!response.ok) throw new Error("Failed to fetch achievements.");
        this.achievements = await response.json();
        console.log("Achievements loaded:", this.achievements);
      } catch (err) {
        this.error = err.message;
        console.error("Error fetching achievements:", err);
      } finally {
        this.loading = false;
      }
    },
    async addAchievement() {
      if (
        !this.game ||
        !this.achievement ||
        isNaN(this.progress) ||
        this.progress < 0 ||
        this.progress > 100
      ) {
        alert("Please enter valid game details and progress (0–100%).");
        return;
      }

      try {
        const response = await fetch("/api/achievements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appid: this.appid,
            game: this.game,
            achievement: this.achievement,
            progress: this.progress
          })
        });

        if (!response.ok) throw new Error("Failed to add achievement.");
        const newAchievement = await response.json();
        this.achievements.push(newAchievement);
        this.resetForm();
      } catch (err) {
        console.error("Error adding achievement:", err);
        alert(err.message);
      }
    },
    resetForm() {
      this.appid = null;
      this.game = "";
      this.achievement = "";
      this.progress = null;
    }
  },
  mounted() {
    this.fetchAchievements();
  }
};
</script>

<style scoped>
form {
  margin-bottom: 1rem;
}
.form-group {
  margin-bottom: 0.5rem;
}
input {
  padding: 0.5rem;
  width: 100%;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 2rem;
  font-family: 'Segoe UI', sans-serif;
}
img {
  display: block;
  margin-bottom: 0.5rem;
  border-radius: 6px;
}
</style>

    async addAchievement() {
      if (
        !this.game ||
        !this.achievement ||
        isNaN(this.progress) ||
        this.progress < 0 ||
        this.progress > 100
      ) {
        alert("Please enter valid game details and progress (0–100%).");
        return;
      }

      try {
        const response = await fetch("/api/achievements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appid: this.appid,
            game: this.game,
            achievement: this.achievement,
            progress: this.progress
          })
        });

        if (!response.ok) throw new Error("Failed to add achievement.");
        const newAchievement = await response.json();
        this.achievements.push(newAchievement);
        this.resetForm();
      } catch (err) {
        console.error("Error adding achievement:", err);
        alert(err.message);
      }
    },
    resetForm() {
      this.appid = null;
      this.game = "";
      this.achievement = "";
      this.progress = null;
    }
  },
  mounted() {
    this.fetchAchievements();
  }
};
</script>

<style scoped>
form {
  margin-bottom: 1rem;
}
.form-group {
  margin-bottom: 0.5rem;
}
input {
  padding: 0.5rem;
  width: 100%;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 2rem;
  font-family: 'Segoe UI', sans-serif;
}
img {
  display: block;
  margin-bottom: 0.5rem;
  border-radius: 6px;
}
</style>