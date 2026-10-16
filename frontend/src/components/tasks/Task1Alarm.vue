<template>
  <Task1Master
    v-if="role === 'master'"
    :komponenten="daten.komponenten"
    :defekt-id="daten.defektId"
    :code="daten.code"
  />
  <Task1P1
    v-else-if="role === 'P1'"
    :symbole="daten.symbole"
    :richtiges-symbol="daten.richtigesSymbol"
    @solved="emit('solved', $event)"
    @failed="emit('failed', $event)"
  />
  <Task1P2
    v-else
    :code="daten.code"
    @solved="emit('solved', $event)"
    @failed="emit('failed', $event)"
  />
</template>

<script setup>
import Task1Master from './task1/Task1Master.vue'
import Task1P1 from './task1/Task1P1.vue'
import Task1P2 from './task1/Task1P2.vue'
import { TASK1_DATEN } from './task1/task1Daten.js'

defineProps({
  role: { type: String, required: true }, // master, P1, P2
  daten: { type: Object, default: () => TASK1_DATEN }
})
const emit = defineEmits(['solved', 'failed'])
</script>