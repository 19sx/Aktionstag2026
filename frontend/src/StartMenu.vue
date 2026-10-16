<template>
  <div class="start">
    <div class="hero">
      <img src="./assets/start-screen2.jpg" alt="" />
    </div>

    <div class="overlay">
      <div class="top">
        <button class="settings-link" @click="openSettings">Einstellungen</button>
      </div>

      <div class="content">
        <h1 class="title">DRV-BOX</h1>
        <p class="sub">Rettet den Server!</p>

        <div class="form">
          <label class="field">
            <span class="label">Dein Name</span>
            <input
              v-model="name"
              class="input"
              placeholder="z.B. Patrick"
              maxlength="20"
              @keyup.enter="starten('player')"
            />
          </label>

          <div class="actions">
            <button
              class="btn btn-primary btn-start"
              :disabled="!name.trim()"
              @click="starten('player')"
            >
              Als Spieler
            </button>
            <button class="btn btn-host" @click="starten('host')">
              Als Host
            </button>
          </div>
        </div>
      </div>

      <div class="bottom">
        <span class="dim version">v1.0</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const emit = defineEmits(['spiel-starten', 'open-settings'])

function starten(role) {
  if (role === 'player' && !name.value.trim()) return
  emit('spiel-starten', { name: name.value.trim(), role })
}

function openSettings() {
  emit('open-settings')
}
</script>

<style scoped>
.start {
  position: relative;
  height: 100dvh;
  width: 100vw;
  overflow: hidden;
  background: var(--bg);
}

.hero {
  position: absolute;
  inset: 0;
}

.hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.5;
  filter: brightness(0.8);
}

.overlay {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--space-5) 60px;
  background: linear-gradient(
    180deg,
    rgba(10, 15, 12, 0.75) 0%,
    rgba(10, 15, 12, 0.4) 40%,
    rgba(10, 15, 12, 0.92) 100%
  );
}

.top {
  display: flex;
  justify-content: flex-end;
}

.settings-link {
  background: none;
  border: none;
  color: var(--fg-3);
  font-family: var(--sans);
  font-size: var(--text-sm);
  cursor: pointer;
  padding: 6px 4px;
  letter-spacing: 0.05em;
  transition: color 0.15s;
}

.settings-link:hover { color: var(--green); }

.content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  max-width: 720px;
}

.title {
  font-family: var(--mono);
  font-size: 96px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  line-height: 0.95;
  letter-spacing: -0.03em;
}

.sub {
  font-family: var(--sans);
  font-size: 22px;
  color: var(--green);
  margin: 0 0 var(--space-4) 0;
  letter-spacing: 0.02em;
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 100%;
  max-width: 1500px;
  height: auto;
  display: block;
  opacity: 0.95;
}
</style>