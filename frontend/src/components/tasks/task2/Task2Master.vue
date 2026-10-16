<template>
  <div class="task">
    <header class="head">
      <h2 class="title">Löschprotokoll</h2>
      <span class="role">Master</span>
    </header>

    <p class="hint">Sage P1 die Ventil-Sequenz. Sage P2 die Passwort-Reihenfolge.</p>

    <div v-if="!view" class="empty">Warte auf Task-Daten …</div>

    <div v-else class="body">
      <section class="panel">
        <span class="panel-label">Ventil-Sequenz (P1)</span>
        <div class="seq">
          <div
            v-for="(s, i) in view.sequence"
            :key="i"
            class="seq-item"
            :class="{ done: i < view.step, current: i === view.step }"
          >
            <span class="seq-num">{{ i + 1 }}</span>
            <span class="seq-valve">{{ s.valve }}</span>
            <span class="seq-color">
              <span class="color-dot" :style="{ background: colorHex(s.color) }"></span>
              {{ s.color }}
            </span>
          </div>
        </div>
      </section>

      <section class="panel">
        <span class="panel-label">Passwort-Reihenfolge (P2)</span>

        <div class="order">
          <div v-for="(idx, pos) in view.order" :key="pos" class="order-item">
            <span class="order-pos">{{ pos + 1 }}</span>
            <span class="order-ref">Teil #{{ idx }}</span>
            <span class="order-val">{{ alleTeile[idx] }}</span>
          </div>
        </div>

        <div class="preview">
          <span class="preview-label">Passwort</span>
          <span class="preview-val">{{ view.password_preview }}</span>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  view: { type: Object, default: null }
})

const COLOR_HEX = {
  ORANGE: '#ff8a00',
  RED:    '#ff0055',
  GREEN:  '#00ff66',
}

function colorHex(name) {
  return COLOR_HEX[(name || '').toUpperCase()] || '#555'
}

const alleTeile = computed(() => {
  if (!props.view) return []
  return [...props.view.fragments, props.view.last_fragment]
})
</script>

<style scoped>
.task {
  flex: 1;
  min-height: 0;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: var(--bg-1);
  border: 1px solid var(--border);
  padding: 28px 36px;
  overflow: hidden;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.title {
  font-size: 16px;
  font-weight: 700;
  color: var(--fg);
  margin: 0;
}

.role {
  font-size: 11px;
  font-weight: 600;
  color: var(--green);
  padding: 4px 12px;
  border: 1px solid var(--green-border);
  letter-spacing: 0.15em;
}

.hint {
  font-size: 13px;
  color: var(--fg-3);
  margin: 0 0 24px 0;
}

.empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--fg-3);
  font-size: 14px;
}

.body {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 28px;
  background: var(--bg-2);
  border: 1px solid var(--border-2);
}

.panel-label {
  font-size: 11px;
  color: var(--fg-3);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-weight: 600;
}

.seq {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.seq-item {
  display: grid;
  grid-template-columns: 44px 1fr 1fr;
  align-items: center;
  gap: 18px;
  padding: 20px 22px;
  background: var(--bg-1);
  border: 1px solid var(--border-2);
}

.seq-item.done { opacity: 0.5; border-color: var(--green-border); }

.seq-item.current {
  border-color: var(--green);
  box-shadow: 0 0 0 3px var(--green-bg);
}

.seq-num {
  font-family: var(--mono);
  font-size: 22px;
  font-weight: 700;
  color: var(--green);
}

.seq-valve {
  font-family: var(--mono);
  font-size: 24px;
  font-weight: 700;
  color: var(--fg);
  letter-spacing: 0.1em;
}

.seq-color {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--mono);
  font-size: 18px;
  font-weight: 600;
  color: var(--fg);
  letter-spacing: 0.1em;
}

.color-dot {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 1px solid var(--border-3);
}

.order {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-item {
  display: grid;
  grid-template-columns: 44px 100px 1fr;
  align-items: center;
  gap: 18px;
  padding: 16px 22px;
  background: var(--bg-1);
  border: 1px solid var(--border-2);
}

.order-pos {
  font-family: var(--mono);
  font-size: 22px;
  font-weight: 700;
  color: var(--amber, #ffb830);
}

.order-ref {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--fg-3);
  letter-spacing: 0.1em;
}

.order-val {
  font-family: var(--mono);
  font-size: 22px;
  font-weight: 700;
  color: var(--green);
  letter-spacing: 0.1em;
}

.preview {
  margin-top: auto;
  padding: 22px;
  background: var(--bg-1);
  border: 1px dashed var(--green-border);
  text-align: center;
}

.preview-label {
  display: block;
  font-size: 11px;
  color: var(--fg-3);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 10px;
  font-weight: 600;
}

.preview-val {
  font-family: var(--mono);
  font-size: 28px;
  font-weight: 700;
  color: var(--green);
  letter-spacing: 0.1em;
  word-break: break-all;
}
</style>