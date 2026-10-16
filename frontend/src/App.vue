<template>
  <div class="app">

  <!-- OVERLAY / MODAL SETTINGS -->
  <div v-if="showStartMenuSettings" class="settings-overlay">
    <div class="settings-modal-wrapper">
      <button class="close-btn" @click="showStartMenuSettings = false">
        [ X ] CLOSE_SETTINGS
      </button>
      <SettingsScreen @save="showStartMenuSettings = false" />
    </div>
  </div>

  <!-- 0. STARTMENÜ -->
  <StartMenu 
    v-else-if="!gestartet" 
    @spiel-starten="onStart" 
    @open-settings="showStartMenuSettings = true" 
  />

  <!-- 1. ROLLENAUSWAHL OVERLAY (Zweistufig) -->
  <div v-else-if="!role" class="role-selection-overlay">
    <div class="role-box">
      
      <!-- STUFE 1: Hauptauswahl (Host oder Player/Client) -->
      <template v-if="roleSubStage === 'main'">
        <div class="title-wrap">
          <span class="prefix">//</span>
          <h2 class="role-title">SYSTEM_AUTHENTICATION</h2>
        </div>

        <p class="sub-text">WÄHLEN SIE IHRE SYSTEMROLLE AUS:</p>

        <div class="role-buttons">
          <button class="role-btn host-btn" @click="role = 'host'">
            <img src="./assets/host_role1.png" alt="Host Role" />
            <span class="btn-num">[ 01 ]</span>
            <span>HOST</span>
          </button>

          <button class="role-btn player-btn" @click="roleSubStage = 'player-choice'">
            <img src="./assets/client_role1.png" alt="Client Role" />
            <span class="btn-num">[ 02 ]</span>
            <span>CLIENT</span>
          </button>
        </div>
      </template>

      <!-- STUFE 2: Unterauswahl nach Klick auf Player (Master vs Normaler Player) -->
      <template v-else-if="roleSubStage === 'player-choice'">
        <div class="title-wrap">
          <span class="prefix">//</span>
          <h2 class="role-title">PLAYER_MODE_SELECT</h2>
        </div>

        <p class="sub-text">WÄHLE DEINEN BEREICH:</p>

        <div class="role-buttons">
          <button class="role-btn master-btn" @click="role = 'master'">
            <img src="./assets/master_role.png" alt="" /> 
            <span class="btn-num">[ A ]</span>
            <span>MASTER / GUIDE</span>
          </button>

          <button class="role-btn player-btn" @click="role = 'player'">
            <img src="./assets/player_role.png" alt="" />
            <span class="btn-num">[ B ]</span>
            <span>NORMALER PLAYER</span>
          </button>
        </div>

        <button class="back-link-btn" @click="roleSubStage = 'main'">
          &lt; ZURÜCK
        </button>
      </template>

    </div>
  </div>

  <!-- 2. HAUPT-APP -->
  <div v-else class="app-wrapper">
    <header class="navbar">
      <div class="nav-brand">
        <span class="status-dot"></span>
        <span class="brand-text">
          DRV-Projekt <small>({{ role.toUpperCase() }})</small>
        </span>
      </div>
    </div>
    </header>

    <StartMenu
      v-else-if="!gestartet"
      @spiel-starten="onStart"
      @open-settings="showSettings = true"
    />

    <HostScreen
      v-else-if="mode === 'host'"
      @exit="zurueck"
    />

    <PlayerScreen
      v-else-if="mode === 'player'"
      :player-name="playerName"
      @exit="zurueck"
    />

  </div>
</template>

<script setup>
import { ref } from 'vue'
import StartMenu from './StartMenu.vue'
import HostScreen from './components/HostScreen.vue'
import PlayerScreen from './components/PlayerScreen.vue'
import SettingsScreen from './components/SettingsScreen.vue'

const gestartet = ref(false)
const mode = ref(null)
const playerName = ref('')
const showSettings = ref(false)

function onStart(daten) {
  gestartet.value = true
  mode.value = daten.role
  playerName.value = daten.name
}

function zurueck() {
  gestartet.value = false
  mode.value = null
  playerName.value = ''
}
</script>

<style scoped>
.app {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg);
}

.settings-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 10, 8, 0.92);
  display: flex;
  justify-content: center;
  padding: 48px 24px;
  z-index: 100;
  overflow-y: auto;
}

.close-btn {
  background: transparent;
  border: 1px solid #ff0055;
  color: #ff0055;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  display: block;
  margin-left: auto;
  transition: all 0.2s ease;
}

.role-selection-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background-color: #020404;
  padding: 1.5rem;
  box-sizing: border-box;
}

.role-box {
  background-color: #050a08;
  border: 1px solid #00ff66;
  border-radius: 4px;
  padding: 2.5rem 2rem;
  max-width: 1700px; /* war 520px, damit zwei Kacheln nebeneinander passen */
  width: 100%;
  max-width: 640px;
}

.title-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 0.5rem;
}

.prefix {
  color: #00ff66;
  font-size: 1.3rem;
  font-weight: bold;
}

.role-title {
  color: #00ff66;
  font-size: 1.35rem;
  font-weight: bold;
  letter-spacing: 1px;
  margin: 0;
  text-shadow: 0 0 1px rgba(0, 255, 102, 0.6);
  word-break: break-all;
}

.sub-text {
  color: #008833;
  margin-top: 0;
  margin-bottom: 2rem;
  font-size: 0.8rem;
  letter-spacing: 1px;
}

/* ===== ROLLEN-KACHELN: getrennt nebeneinander, ohne Rand ===== */
.role-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.role-btn {
  --c: #00ff66;
  font-family: inherit;
  font-size: 2.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  padding: 3.75rem 2.5rem 3.5rem;
  background: color-mix(in srgb, var(--c) 7%, #030806);
  border: none;
  border-radius: 6px;
  color: var(--c);
  cursor: pointer;
  letter-spacing: 1rem;
  transition: transform 0.2s, background 0.2s;
}

.role-btn:hover {
  background: color-mix(in srgb, var(--c) 18%, #000000);
  transform: translateY(-4px);
}

/* Platz für deine Bilder (das <img> aus den Kommentaren oben) */
.role-btn img {
  width: 100%;
  height: 350px;
  object-fit: contain; /* "cover" füllt die Fläche komplett aus */
}

.role-btn span:last-child {
  font-weight: bold;
}

.btn-num {
  opacity: 0.7;
}

.host-btn   { --c: #00ff66; }
.player-btn { --c: #00ff66; }
.master-btn { --c: #ff0055; }

@media (max-width: 560px) {
  .role-buttons { grid-template-columns: 1fr; }
}

.back-link-btn {
  background: transparent;
  border: none;
  color: #05ef5f;
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
}

</style>