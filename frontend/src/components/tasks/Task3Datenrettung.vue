<template>
  <div class="w-full h-full flex items-center justify-center">
    <!-- 1. Master / Host Ansicht -->
    <Task3Master 
      v-if="normalizedRole === 'HOST' || normalizedRole === 'M' || normalizedRole === 'MASTER'"
      :p1-status="p1Status"
      :p2-status="p2Status"
    />

    <!-- 2. Spieler 1 (ASCII) Ansicht -->
    <Task3P1 
      v-else-if="normalizedRole === 'P1'"
      :ascii-codes="asciiCodes"
      :ergebnis="p1Ergebnis"
      @solved="handleP1Solved"
      @failed="handleP1Failed"
    />

    <!-- 3. Spieler 2 (Binär) Ansicht -->
    <Task3P2 
      v-else-if="normalizedRole === 'P2'"
      :binary-codes="binaryCodes"
      :ergebnis="p2Ergebnis"
      @solved="handleP2Solved"
      @failed="handleP2Failed"
    />

    <!-- Unbekannte/Fehlende Rolle -->
    <div v-else class="text-red-500 font-mono p-4 border border-red-500 bg-black">
      [ ERROR: UNBEKANNTE ROLLE '{{ role }}' ]
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import Task3Master from './task3/Task3Master.vue'
import Task3P1 from './task3/Task3P1.vue'
import Task3P2 from './task3/Task3P2.vue'

const props = defineProps({
  
  role: {
    type: String,
    required: true
  },
  // Optionale Daten-Props (falls sie vom WebSocket / Backend kommen)
  asciiCodes: {
    type: Array,
    default: () => [83, 69, 82, 86, 69, 82] // Standard: 'SERVER'
  },
  binaryCodes: {
    type: Array,
    default: () => ['01000001', '01000010'] // Standard: 65, 66
  }
})

const emit = defineEmits(['task-solved', 'p1-solved', 'p2-solved', 'task-failed'])

// Lokaler Status für das Feedback an den Master & Spieler
const p1Status = ref('GESPERRT') 
const p2Status = ref('GESPERRT')

const p1Ergebnis = ref(null) 
const p2Ergebnis = ref(null)

// Rolle verlässlicher in Großbuchstaben umwandeln
// Backend-Rollennamen (FI-SI = P1, FI-AE = P2) auf die Namen der Templates abbilden
const ROLE_ALIASES = { 'FI-SI': 'P1', 'FI-AE': 'P2' }
const normalizedRole = computed(() => {
  const role = props.role ? props.role.toUpperCase() : ''
  return ROLE_ALIASES[role] || role
})

// Handler für Spieler 1
function handleP1Solved(payload) {
  p1Ergebnis.value = 'correct'
  p1Status.value = 'FREIGESCHALTET'
  emit('p1-solved', payload)
  checkBothSolved()
}

function handleP1Failed(payload) {
  p1Ergebnis.value = 'wrong'
  emit('task-failed', { player: 'P1', payload })
}

// Handler für Spieler 2
function handleP2Solved(payload) {
  p2Ergebnis.value = 'correct'
  p2Status.value = 'FREIGESCHALTET'
  emit('p2-solved', payload)
  checkBothSolved()
}

function handleP2Failed(payload) {
  p2Ergebnis.value = 'wrong'
  emit('task-failed', { player: 'P2', payload })
}

// Prüft, ob beide bereit sind (kann auch vom Backend gesteuert werden)
function checkBothSolved() {
  if (p1Status.value === 'FREIGESCHALTET' && p2Status.value === 'FREIGESCHALTET') {
    emit('task-solved', { task: 3 })
  }
}
</script>