<template>
  <div class="task">
    <header class="head">
      <h2 class="title">Alarm verifizieren</h2>
      <span class="role">Master</span>
    </header>

    <p class="hint">Sage P1 das Symbol der defekten Komponente. Sage P2 die Reihenfolge der Code-Symbole.</p>

    <div v-if="!view" class="empty">Warte auf Task-Daten …</div>

    <div v-else class="body">

      <!-- Komponenten mit Symbolen -->
      <section class="panel">
        <span class="panel-label">Komponenten</span>

        <div class="comp-list">
          <div
            v-for="k in komponenten"
            :key="k.id"
            class="comp"
            :class="{ broken: k.id === defektId }"
          >
            <div class="comp-icon">
              <SymbolIcon
                :name="k.symbol"
                :farbe="k.id === defektId ? '#ff3a4d' : '#d6ffe3'"
                :size="56"
              />
            </div>
            <span class="comp-name">{{ k.label }}</span>
            <span class="comp-state">{{ k.id === defektId ? 'DEFEKT' : 'OK' }}</span>
          </div>
        </div>
      </section>

      <!-- Freigabe-Code -->
      <section class="panel">
        <span class="panel-label">Freigabe-Code für P2</span>

        <div class="code-row">
          <div v-for="(s, i) in code" :key="i" class="code-cell">
            <SymbolIcon :name="s" :size="80" :farbe="'#d6ffe3'" />
            <span class="code-pos">{{ i + 1 }}</span>
          </div>
        </div>

        <p class="code-hint">P2 gibt diese 4 Symbole in dieser Reihenfolge ein.</p>
      </section>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SymbolIcon from '../graphic-symbols/SymbolIcon.vue'

const props = defineProps({
  view: { type: Object, default: null }
})

const komponenten = [
  { id: 'K1', label: 'NETZWERK-SWITCH 2', symbol: 'raute' },
  { id: 'K2', label: 'HAUPT-STROM B-04',  symbol: 'dreieck' },
  { id: 'K3', label: 'LÜFTUNG SYSTEM A',  symbol: 'quadrat' },
  { id: 'K4', label: 'FIREWALL-MODUL',    symbol: 'kreis' },
]

const defektId = computed(() => props.view?.component || null)
const code     = computed(() => props.view?.code || [])
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
  gap: 16px;
  padding: 24px;
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

/* Komponenten-Liste */
.comp-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.comp {
  display: grid;
  grid-template-columns: 72px 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  background: var(--bg-1);
  border: 1px solid var(--border-2);
}

.comp.broken {
  border-color: var(--red);
  background: rgba(255, 58, 77, 0.08);
}

.comp-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
}

.comp-name {
  font-family: var(--mono);
  font-size: 14px;
  font-weight: 600;
  color: var(--fg);
}

.comp-state {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--fg-3);
  letter-spacing: 0.15em;
  font-weight: 600;
}

.comp.broken .comp-state {
  color: var(--red);
}

/* Code */
.code-row {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 12px 0;
}

.code-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 110px;
  height: 130px;
  background: var(--bg-1);
  border: 1px solid var(--border-2);
}

.code-pos {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--fg-3);
  letter-spacing: 0.2em;
  font-weight: 600;
}

.code-hint {
  font-size: 12px;
  color: var(--fg-3);
  text-align: center;
  margin: 0;
  letter-spacing: 0.05em;
}
</style>