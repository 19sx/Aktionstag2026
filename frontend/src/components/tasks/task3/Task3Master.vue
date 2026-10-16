<template>
  <div class="task">
    <header class="head">
      <h2 class="title">Datenrettung</h2>
      <span class="role">Master</span>
    </header>

    <p class="hint">P1 braucht die ASCII-Tabelle, P2 die Binär-Tabelle.</p>

    <div class="body">
      <section class="panel">
        <span class="panel-label">ASCII-Tabelle</span>
        <div class="grid ascii">
          <div v-for="item in asciiTable" :key="item.char" class="cell">
            <span class="cell-key">{{ item.char }}</span>
            <span class="cell-val">{{ item.dec }}</span>
          </div>
        </div>
      </section>

      <section class="panel">
        <span class="panel-label">Binär-Tabelle</span>
        <div class="grid binary">
          <div v-for="item in binaryTable" :key="item.bin" class="cell">
            <span class="cell-key">{{ item.bin }}</span>
            <span class="cell-val">{{ item.dec }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({ view: { type: Object, default: null } })

const asciiTable = ref([
  { char: 'A', dec: 65 }, { char: 'B', dec: 66 }, { char: 'C', dec: 67 },
  { char: 'D', dec: 68 }, { char: 'E', dec: 69 }, { char: 'F', dec: 70 },
  { char: 'G', dec: 71 }, { char: 'H', dec: 72 }, { char: 'I', dec: 73 },
  { char: 'J', dec: 74 }, { char: 'K', dec: 75 }, { char: 'L', dec: 76 },
  { char: 'M', dec: 77 }, { char: 'N', dec: 78 }, { char: 'O', dec: 79 },
  { char: 'P', dec: 80 }, { char: 'Q', dec: 81 }, { char: 'R', dec: 82 },
  { char: 'S', dec: 83 }, { char: 'T', dec: 84 }, { char: 'U', dec: 85 },
  { char: 'V', dec: 86 }, { char: 'W', dec: 87 }, { char: 'X', dec: 88 }
])

const binaryTable = ref([
  { bin: '0000', dec: 0 }, { bin: '0001', dec: 1 }, { bin: '0010', dec: 2 }, { bin: '0011', dec: 3 },
  { bin: '0100', dec: 4 }, { bin: '0101', dec: 5 }, { bin: '0110', dec: 6 }, { bin: '0111', dec: 7 },
  { bin: '1000', dec: 8 }, { bin: '1001', dec: 9 }, { bin: '1010', dec: 10 }, { bin: '1011', dec: 11 },
  { bin: '1100', dec: 12 }, { bin: '1101', dec: 13 }, { bin: '1110', dec: 14 }, { bin: '1111', dec: 15 }
])
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
  min-height: 0;
}

.panel-label {
  font-size: 11px;
  color: var(--fg-3);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-weight: 600;
}

.grid {
  flex: 1;
  display: grid;
  gap: 6px;
  align-content: start;
  min-height: 0;
  overflow-y: auto;
}

.ascii  { grid-template-columns: repeat(3, 1fr); }
.binary { grid-template-columns: repeat(2, 1fr); }

.cell {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: var(--bg-1);
  border: 1px solid var(--border-2);
  font-family: var(--mono);
}

.cell-key {
  font-size: 15px;
  font-weight: 700;
  color: var(--fg);
  letter-spacing: 0.05em;
}

.cell-val {
  font-size: 14px;
  font-weight: 700;
  color: var(--green);
  letter-spacing: 0.05em;
}
</style>