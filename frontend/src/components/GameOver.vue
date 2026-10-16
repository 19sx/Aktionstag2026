<template>
  <div class="end">
    <img class="end-bg" :src="bild" alt="" />

    <div class="end-card">
      <p class="end-status" :class="istSieg ? 'win' : 'lose'">
        {{ istSieg ? 'Mission erfüllt' : 'Server ausgefallen' }}
      </p>

      <p class="end-score">{{ score }}</p>
      <p class="end-label">Punkte</p>

      <p class="end-meta">Überlebt · {{ survivedSeconds }}s</p>

      <button
        v-if="showRestart"
        class="restart-btn"
        :disabled="restarting"
        @click="$emit('restart')"
      >
        {{ restarting ? 'Neustart …' : 'Neustart' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  result: { type: String, default: 'meltdown' },
  score: { type: Number, default: 0 },
  survivedSeconds: { type: Number, default: 0 },
  showRestart: { type: Boolean, default: false },
  restarting: { type: Boolean, default: false },
})

defineEmits(['restart'])

const istSieg = computed(() => props.result === 'victory')

const bild = computed(() => {
  const name = istSieg.value ? 'win-screen2.jpg' : 'game-over2.jpg'
  return new URL(`../assets/${name}`, import.meta.url).href
})
</script>

<style scoped>
.end {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
}

.end-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.3;
  filter: grayscale(0.3) brightness(0.7);
}

.end-card {
  position: relative;
  background: rgba(5, 10, 8, 0.92);
  border: 1px solid var(--border-2);
  padding: 36px 44px;
  text-align: center;
  min-width: 320px;
}

.end-status {
  font-family: var(--mono);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin: 0 0 20px 0;
}

.end-status.win  { color: var(--green); }
.end-status.lose { color: var(--red); }

.end-score {
  font-family: var(--mono);
  font-size: 56px;
  font-weight: 500;
  line-height: 1;
  color: var(--fg);
  margin: 0;
  font-variant-numeric: tabular-nums;
}

.end-label {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--fg-3);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin: 6px 0 24px 0;
}

.end-meta {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--fg-3);
  margin: 0;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.restart-btn {
  margin-top: 24px;
  padding: 12px 48px;
  background: var(--green);
  color: #050a08;
  border: none;
  font-family: var(--mono);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: background 0.15s;
}

.restart-btn:hover:not(:disabled) { background: #4dff8f; }

.restart-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>