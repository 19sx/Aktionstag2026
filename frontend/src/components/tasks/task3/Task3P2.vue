<template>
  <div class="task">
    <header class="head">
      <span class="title">Binär umwandeln</span>
      <span class="role">P2</span>
    </header>

    <p class="hint dim">Binär in Dezimal, mit Leerzeichen trennen</p>

    <div class="codes">
      <div v-for="(b, i) in binaryCodes" :key="i" class="code">{{ b }}</div>
    </div>

    <div class="foot">
      <input
        v-model="eingabe"
        class="input big"
        :class="inputClass"
        placeholder="Z.B. 65 66"
        :disabled="isSolved"
        @keyup.enter="absenden"
      />
      <button
        class="btn btn-primary"
        :disabled="!eingabe.trim() || isSolved"
        @click="absenden"
      >
        {{ isSolved ? 'OK' : 'Prüfen' }}
      </button>

      <p v-if="ergebnis === 'wrong'" class="msg err">Falsch</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  binaryCodes: { type: Array, default: () => ['01000001', '01000010'] }
})
const emit = defineEmits(['solved', 'failed'])

const eingabe = ref('')
const ergebnis = ref(null)
const isSolved = ref(false)

const zielZahlenStr = computed(() =>
  props.binaryCodes.map(bin => parseInt(bin.replace(/\s+/g, ''), 2)).join(' ')
)

const inputClass = computed(() => ({
  err: ergebnis.value === 'wrong',
  ok:  ergebnis.value === 'correct',
}))

function absenden() {
  if (!eingabe.value.trim() || isSolved.value) return
  const versuch = eingabe.value.trim().replace(/\s+/g, ' ')
  if (versuch === zielZahlenStr.value) {
    ergebnis.value = 'correct'
    isSolved.value = true
    emit('solved', { player: 'P2', answer: versuch })
  } else {
    ergebnis.value = 'wrong'
    emit('failed', { player: 'P2', answer: versuch })
    setTimeout(() => { ergebnis.value = null; eingabe.value = '' }, 1500)
  }
}
</script>

<style scoped>
.task {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: var(--bg-1);
  border: 1px solid var(--border);
  padding: 18px;
  max-width: 560px;
  margin: 0 auto;
  width: 100%;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.title { font-size: 14px; font-weight: 600; }

.role {
  font-size: 11px;
  color: var(--green);
  padding: 2px 7px;
  border: 1px solid var(--green-border);
}

.hint { font-size: 12px; margin: 0 0 20px 0; }

.codes {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.code {
  min-width: 90px;
  padding: 12px 10px;
  background: var(--bg-2);
  border: 1px solid var(--border-2);
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  color: var(--fg);
  letter-spacing: 0.08em;
}

.foot {
  flex-shrink: 0;
  padding-top: 14px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.big {
  padding: 12px;
  font-size: 16px;
  text-align: center;
  letter-spacing: 0.12em;
  font-weight: 600;
}

.big.err { border-color: var(--red); color: var(--red); }
.big.ok  { border-color: var(--green-border); color: var(--green); }

.foot .btn {
  padding: 11px;
  font-size: 13px;
  font-weight: 600;
}

.msg {
  font-size: 12px;
  text-align: center;
  margin: 0;
}

.msg.err { color: var(--red); }
</style>