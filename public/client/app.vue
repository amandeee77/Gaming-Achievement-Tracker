<template>
  <div id="app">
    <h1>🎯 Gaming Achievement Tracker</h1>

    <ul>
      <li v-for="a in achievements" :key="a.id">
        🎮 {{ a.game }} — {{ a.achievement }} ({{ a.progress }}%)
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      achievements: []
    };
  },
  methods: {
    async loadAchievements() {
      try {
        const res = await fetch('/api/achievements');
        const data = await res.json();
        this.achievements = data;
      } catch (err) {
        console.error('Failed to fetch achievements:', err);
      }
    }
  },
  mounted() {
    this.loadAchievements();
  }
};
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}
li {
  padding: 0.5rem 0;
  font-family: 'Segoe UI', sans-serif;
  font-size: 1.1rem;
}
</style>