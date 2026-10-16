<template>
  <div class="panel relative overflow-hidden rounded p-4 font-mono text-[#00ff66] sm:p-6">
    <div
      class="pointer-events-none absolute inset-0 z-30 opacity-[0.06]"
      style="background: repeating-linear-gradient(0deg, transparent, transparent 2px, #000 3px);"
    ></div>

    <header class="relative z-20 mb-4 flex flex-wrap items-end justify-between gap-2 border-b border-[#00ff6633] pb-3">
      <div>
        <p class="text-[10px] tracking-[0.35em] text-[#008833]">// MODULE_MANUAL · UI_PROTOTYPE</p>
        <h2 class="text-lg font-bold tracking-widest text-[#00ff66] drop-shadow-[0_0_8px_rgba(0,255,102,0.55)] sm:text-xl">
          DEFUSE_CONSOLE_v0.1
        </h2>
      </div>
      <span class="animate-pulse text-xs text-[#ff0055]">⚠ CRITICAL · DO NOT CUT WRONG WIRE</span>
    </header>

    <!-- Decorative cables -->
    <svg class="pointer-events-none absolute inset-0 z-0 h-full w-full" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
      <path d="M-20,80 C180,40 320,200 520,120 S820,40 1040,160" fill="none" stroke="#ff0055" stroke-width="10" stroke-linecap="round" opacity="0.75" />
      <path d="M-20,220 C200,280 380,140 600,240 S880,320 1040,200" fill="none" stroke="#00f0ff" stroke-width="12" stroke-linecap="round" opacity="0.7" />
      <path d="M-20,480 C160,420 340,560 540,500 S820,420 1040,540" fill="none" stroke="#eab308" stroke-width="11" stroke-linecap="round" opacity="0.75" />
      <path d="M120,-10 C140,180 90,360 160,720" fill="none" stroke="#ff0055" stroke-width="8" stroke-linecap="round" opacity="0.6" />
      <path d="M880,-10 C860,200 920,400 850,720" fill="none" stroke="#00f0ff" stroke-width="9" stroke-linecap="round" opacity="0.6" />
    </svg>

    <div class="relative z-10 grid grid-cols-1 gap-4 lg:grid-cols-12">
      <!-- 1. Log + input -->
      <section class="lg:col-span-7 rounded border border-[#00ff6633] bg-black/90 p-3 shadow-[inset_0_0_30px_rgba(0,0,0,0.85)]">
        <div class="mb-2 flex items-center justify-between text-[10px] uppercase tracking-widest text-[#008833]">
          <span>// TERMINAL_LOG</span>
          <span>{{ logs.length }} LINES</span>
        </div>
        <div
          ref="logBox"
          class="terminal-log mb-3 h-44 overflow-y-auto rounded border border-[#00ff6622] bg-[#020404] p-2 text-xs leading-relaxed text-[#00ff66]/90 sm:h-52"
        >
          <div v-for="(line, i) in logs" :key="i" class="log-line">
            <span class="log-time">{{ line.time }}</span>
            <span class="log-sep"> › </span>
            <span class="log-text">{{ line.text }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="flex flex-1 items-center gap-2 border border-[#00ff6633] bg-[#080d0b] px-2 py-1">
            <span class="text-[#00ff66]">&gt;</span>
            <input
              v-model="command"
              type="text"
              maxlength="80"
              placeholder="Befehl eingeben…"
              class="w-full bg-transparent text-sm text-[#00ff66] outline-none placeholder:text-[#008833]/50"
              @keydown.enter="submitCommand"
            />
          </div>
          <button type="button" class="cyber-btn" :disabled="!command.trim()" @click="submitCommand">
            [ SUBMIT ]
          </button>
        </div>
      </section>

      <!-- 2. Chaos Num-Pad: 0-9 + DEL + ENTER = 12 = 3x4 -->
      <section class="lg:col-span-5 rounded border border-[#00ff6633] bg-[#080d0b]/95 p-3">
        <div class="mb-2 text-[10px] uppercase tracking-widest text-[#008833]">// CHAOS_NUMPAD · SHUFFLED</div>

        <div class="mb-2 flex items-center justify-between border border-[#00ff6633] bg-[#020404] px-2 py-1.5 text-sm">
          <span class="text-[#008833]">CODE:</span>
          <span class="tracking-[0.2em] text-[#00ff66]">{{ pinBuffer || '—' }}</span>
        </div>

        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="n in numPad"
            :key="'d-' + n"
            type="button"
            class="pad-btn"
            @click="pushDigit(n)"
          >
            {{ n }}
          </button>

          <button type="button" class="pad-btn pad-btn--danger" @click="deleteDigit">
            DEL
          </button>
          <button
            type="button"
            class="pad-btn pad-btn--accent"
            :disabled="!pinBuffer"
            @click="submitPin"
          >
            ENT
          </button>
        </div>
        <p class="mt-2 text-[10px] text-[#008833]">Ziffern puffern → ENTER sendet den kompletten String.</p>
      </section>

      <!-- 3. Fan sliders -->
      <section class="lg:col-span-4 rounded border border-[#00ff6633] bg-[#080d0b]/95 p-3">
        <div class="mb-3 text-[10px] uppercase tracking-widest text-[#008833]">// LÜFTERSTEUERUNG</div>
        <div class="flex justify-around gap-2 pt-2">
          <div v-for="fan in fans" :key="fan.id" class="flex flex-col items-center gap-2">
            <span class="text-[10px] text-[#008833]">{{ fan.label }}</span>
            <div class="flex h-36 items-center justify-center">
              <input
                v-model.number="fan.value"
                type="range"
                min="0"
                max="100"
                class="fan-fader"
              />
            </div>
            <span class="text-xs text-[#00ff66]">{{ fan.value }}%</span>
          </div>
        </div>
        <button type="button" class="cyber-btn mt-3 w-full" @click="submitFans">
          [ SUBMIT LÜFTER ]
        </button>
      </section>

      <!-- 4. Rotary knob — freie Skala per Drag -->
      <section class="lg:col-span-3 flex flex-col items-center rounded border border-[#00ff6633] bg-[#080d0b]/95 p-3">
        <div class="mb-3 self-start text-[10px] uppercase tracking-widest text-[#008833]">// SPRINKLER_KNOB</div>
        <div
          ref="knobEl"
          class="knob relative h-28 w-28 select-none rounded-full border-4 border-[#00ff66] bg-[#020404] shadow-[0_0_16px_rgba(0,255,102,0.35)] hover:shadow-[0_0_24px_rgba(0,255,102,0.55)]"
          :class="{ 'knob--dragging': knobDragging }"
          :style="{ transform: `rotate(${knobAngle}deg)` }"
          title="Ziehen zum Drehen"
          @pointerdown="onKnobPointerDown"
        >
          <svg viewBox="0 0 100 100" class="pointer-events-none h-full w-full">
            <circle cx="50" cy="50" r="38" fill="#080d0b" stroke="#00ff66" stroke-width="2" />
            <circle cx="50" cy="50" r="8" fill="#00ff66" />
            <line x1="50" y1="50" x2="50" y2="18" stroke="#00f0ff" stroke-width="4" stroke-linecap="round" />
          </svg>
        </div>
        <div class="mt-2 text-sm tracking-wider text-[#00ff66]">{{ Math.round(knobAngle) }}°</div>
        <p class="mt-1 text-center text-[10px] text-[#008833]">Ziehen = freie Skala · Submit bestätigt</p>
        <button type="button" class="cyber-btn mt-2 w-full" @click="submitKnob">
          [ SUBMIT KNOB ]
        </button>
      </section>

      <!-- 5. Mysterious symbols -->
      <section class="lg:col-span-5 rounded border border-[#00ff6633] bg-[#080d0b]/95 p-3">
        <div class="mb-3 text-[10px] uppercase tracking-widest text-[#008833]">// MYSTERIÖSE SYMBOLE</div>
        <div class="grid grid-cols-5 gap-2">
          <button
            v-for="sym in symbols"
            :key="sym.id"
            type="button"
            class="flex aspect-square items-center justify-center rounded border-2 border-[#00ff6666] bg-[#020404] text-3xl text-[#00ff66] shadow-[0_0_10px_rgba(0,255,102,0.15)] transition active:scale-95"
            :class="{
              'blink-red': blinkingId === sym.id,
              'ring-2 ring-[#00f0ff] border-[#00f0ff]': selectedSymbol?.id === sym.id,
            }"
            @click="selectSymbol(sym)"
          >
            {{ sym.glyph }}
          </button>
        </div>
        <button
          type="button"
          class="cyber-btn mt-3 w-full"
          :disabled="!selectedSymbol"
          @click="submitSymbol"
        >
          [ SUBMIT SYMBOL ]
        </button>
      </section>
    </div>

    <footer class="relative z-20 mt-4 border-t border-[#00ff6633] pt-2 text-[10px] tracking-wider text-[#008833]">
      PROTOTYP · NUR UI · KEINE SPIEL-LOGIK · NAV: MANUAL
    </footer>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function stamp() {
  return new Date().toLocaleTimeString('de-DE', { hour12: false })
}

const logs = ref([
  { time: stamp(), text: 'System online…' },
  { time: stamp(), text: 'Warnung: Druck hoch' },
  { time: stamp(), text: 'Kabel-Integrity: UNBEKANNT' },
])

const command = ref('')
const logBox = ref(null)
const numPad = ref(shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]))
const pinBuffer = ref('')
const knobAngle = ref(0)
const knobEl = ref(null)
const knobDragging = ref(false)
const blinkingId = ref(null)
const selectedSymbol = ref(null)

const fans = reactive([
  { id: 1, label: 'Lüfter 1', value: 40 },
  { id: 2, label: 'Lüfter 2', value: 65 },
  { id: 3, label: 'Lüfter 3', value: 20 },
])

const symbols = [
  { id: 'rad', glyph: '☢', warning: '☢ KERNTEMPERATUR STEIGT — ABBRUCH UNMÖGLICH' },
  { id: 'bio', glyph: '☣', warning: '☣ BIOHAZARD-SCHLEUSE NICHT GESICHERT' },
  { id: 'bolt', glyph: '⚡', warning: '⚡ ÜBERSPANNUNG AUF BUS B' },
  { id: 'gear', glyph: '⚙', warning: '⚙ GETRIEBE BLOCKIERT — MANUELLE FREIGABE' },
  { id: 'star', glyph: '⍟', warning: '⍟ PROTOCOLL Ω FREIGESCHALTET' },
]

async function appendLog(text) {
  logs.value.push({ time: stamp(), text })
  await nextTick()
  if (logBox.value) {
    logBox.value.scrollTop = logBox.value.scrollHeight
  }
}

function submitCommand() {
  const text = command.value.trim()
  if (!text) return
  appendLog(`INPUT: ${text}`)
  command.value = ''
}

function pushDigit(n) {
  if (pinBuffer.value.length >= 12) return
  pinBuffer.value += String(n)
}

function deleteDigit() {
  pinBuffer.value = pinBuffer.value.slice(0, -1)
}

function submitPin() {
  if (!pinBuffer.value) return
  appendLog(`NUMPAD SUBMIT › ${pinBuffer.value}`)
  pinBuffer.value = ''
}

function submitFans() {
  const summary = fans.map((f) => `${f.label}=${f.value}%`).join(' | ')
  appendLog(`LÜFTER SUBMIT › ${summary}`)
}

function angleFromPointer(event) {
  const el = knobEl.value
  if (!el) return knobAngle.value
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  // 0° = oben, im Uhrzeigersinn
  const rad = Math.atan2(event.clientY - cy, event.clientX - cx)
  let deg = (rad * 180) / Math.PI + 90
  if (deg < 0) deg += 360
  return deg
}

function onKnobPointerMove(event) {
  if (!knobDragging.value) return
  knobAngle.value = angleFromPointer(event)
}

function onKnobPointerUp() {
  if (!knobDragging.value) return
  knobDragging.value = false
  window.removeEventListener('pointermove', onKnobPointerMove)
  window.removeEventListener('pointerup', onKnobPointerUp)
}

function onKnobPointerDown(event) {
  event.preventDefault()
  knobDragging.value = true
  knobAngle.value = angleFromPointer(event)
  window.addEventListener('pointermove', onKnobPointerMove)
  window.addEventListener('pointerup', onKnobPointerUp)
}

function submitKnob() {
  appendLog(`SPRINKLER SUBMIT › ${Math.round(knobAngle.value)}°`)
}

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onKnobPointerMove)
  window.removeEventListener('pointerup', onKnobPointerUp)
})

function selectSymbol(sym) {
  selectedSymbol.value = sym
  blinkingId.value = sym.id
  setTimeout(() => {
    if (blinkingId.value === sym.id) blinkingId.value = null
  }, 600)
}

function submitSymbol() {
  if (!selectedSymbol.value) return
  appendLog(`SYMBOL SUBMIT › ${selectedSymbol.value.warning}`)
}

onMounted(() => {
  appendLog('DEFUSE_CONSOLE bereit. Warte auf Operator…')
})
</script>

<style scoped>
.panel {
  background-color: #080d0b;
  border: 1px solid #00ff6633;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.9), inset 0 0 10px rgba(0, 255, 102, 0.02);
}

.terminal-log {
  text-align: left !important;
  direction: ltr;
}

.log-line {
  display: block;
  text-align: left !important;
  margin: 0;
  padding: 0.15rem 0;
  border-bottom: 1px solid #00ff6611;
  white-space: pre-wrap;
  word-break: break-word;
}

.log-time {
  color: #008833;
}

.log-sep {
  color: rgba(0, 136, 51, 0.6);
}

.log-text {
  color: rgba(0, 255, 102, 0.9);
}

.knob {
  cursor: grab;
  touch-action: none;
}

.knob--dragging {
  cursor: grabbing;
  transition: none;
}

.cyber-btn {
  font-family: inherit;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  padding: 0.55rem 0.9rem;
  background: #030806;
  border: 1px solid #00ff66;
  color: #00ff66;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
  box-shadow: 0 0 10px rgba(0, 255, 102, 0.12);
}

.cyber-btn:hover:not(:disabled) {
  background: #00ff66;
  color: #000;
  box-shadow: 0 0 18px rgba(0, 255, 102, 0.55);
}

.cyber-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  border-color: #008833;
  color: #008833;
  box-shadow: none;
}

.pad-btn {
  aspect-ratio: 1;
  font-family: inherit;
  font-size: 1.15rem;
  font-weight: 700;
  border-radius: 0.25rem;
  border: 1px solid #00ff6666;
  background: #020404;
  color: #00ff66;
  cursor: pointer;
  box-shadow: 0 0 8px rgba(0, 255, 102, 0.15);
  transition: all 0.15s ease;
}

.pad-btn:hover:not(:disabled) {
  background: #00ff66;
  color: #000;
}

.pad-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.pad-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.pad-btn--danger {
  border-color: #ff0055;
  color: #ff0055;
  box-shadow: 0 0 8px rgba(255, 0, 85, 0.2);
}

.pad-btn--danger:hover:not(:disabled) {
  background: #ff0055;
  color: #000;
}

.pad-btn--accent {
  border-color: #00f0ff;
  color: #00f0ff;
  box-shadow: 0 0 8px rgba(0, 240, 255, 0.2);
  font-size: 0.95rem;
}

.pad-btn--accent:hover:not(:disabled) {
  background: #00f0ff;
  color: #000;
}

.fan-fader {
  width: 9rem;
  height: 0.55rem;
  transform: rotate(-90deg);
  cursor: pointer;
  accent-color: #00ff66;
}

.blink-red {
  animation: blink-red 0.15s ease-in-out 4;
  border-color: #ff0055 !important;
  color: #ffb3c7 !important;
  box-shadow: 0 0 18px rgba(255, 0, 85, 0.85) !important;
}

@keyframes blink-red {
  0%,
  100% {
    background-color: #2a0010;
  }
  50% {
    background-color: #ff0055;
  }
}
</style>
