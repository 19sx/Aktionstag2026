<template>
  <div class="client">

    <GameOver
      v-if="istSpielVorbei"
      :result="gameOverResult"
      :score="gameOverScore"
      :survived-seconds="gameOverSurvived"
    />

    <!-- Verbinden -->
    <div v-else-if="!hasJoined" class="connect">
      <div class="connect-card">
        <h2 class="connect-title">Verbinden</h2>

        <label class="field">
          <span class="field-label">Sitzungs-ID</span>
          <input v-model="gameId" class="input" placeholder="a3k9" maxlength="8" />
        </label>

        <label class="field">
          <span class="field-label">Dein Name</span>
          <input
            v-model="playerName"
            class="input"
            placeholder="Patrick"
            maxlength="20"
            @keyup.enter="handleJoin"
          />
        </label>

          <div class="form-group">
            <input
              v-model="gameId"
              type="text"
              placeholder="GAME ID"
              class="cyber-input"
            />
            <input
              v-model="playerName"
              type="text"
              placeholder="DEIN SPIELERNAME"
              class="cyber-input"
              @keyup.enter="handleJoin"
            />
            <button
              class="cyber-btn"
              :disabled="!gameId.trim() || !playerName.trim()"
              @click="handleJoin"
            >
              [ CONNECT TO SESSION ]
            </button>
          </div>
        </div>

        <div v-else class="game-section">
          <div class="info-bar">
            <div>SESSION: <span class="highlight">{{ gameId.toUpperCase() }}</span></div>
            <div>AGENT: <span class="highlight">{{ playerName }}</span> ({{ playerRole }})</div>
          </div>

          <div class="lobby-box">
            <div class="box-label">// LOBBY_STATUS (STATUS: {{ status.toUpperCase() }})</div>
            <div v-if="lobbyPlayers.length === 0" class="muted-text">
              Warte auf Spielerdaten vom Server...
            </div>
            <div v-else class="player-list">
              <div v-for="(p, index) in lobbyPlayers" :key="index" class="player-item">
                <span>> {{ typeof p === 'object' ? (p.name || p.playerName) : p }}</span>
                <span class="status-badge">[ CONNECTED ]</span>
              </div>
            </div>

            <div v-if="status !== 'running'" class="start-box">
              <button
                class="cyber-btn start-btn"
                :disabled="!isConnected || lobbyPlayers.length < 2"
                @click="startGame"
              >
                {{ lobbyPlayers.length < 2 ? `[ WARTE AUF 2 SPIELER (${lobbyPlayers.length}/2) ]` : '[ START GAME SESSION ]' }}
              </button>
            </div>
          </div>

          <div class="hp-box">
            <div class="hp-label">
              <span>SERVER_INTEGRITY</span>
              <span>{{ hp }} / 300 HP</span>
            </div>
            <div class="hp-bar-track">
              <div
                class="hp-bar-fill"
                :style="{ width: Math.min(100, Math.max(0, (hp / 300) * 100)) + '%' }"
              ></div>
            </div>
          </div>

          <!-- TASK 1: P1 waehlt das Symbol, P2 tippt den Code -->
          <div v-if="currentTask === 1" class="task1-container">
            <Task1Alarm :role="playerRole" @solved="onTaskSolved(playerRole)" @failed="onTaskFailed" />
          </div>

          <!-- TASK 3 -->
          <div v-else-if="currentTask === 3 || task?.type === 'task3'" class="task3-container">
            <Task3Datenrettung
              :role="playerRole"
              :task="task"
              :symbole="task1Symbole"
              :richtiges-symbol="task1RichtigesSymbol"
              :code="task1Code"
              :ascii-codes="task3Ascii"
              :binary-codes="task3Binary"
              :p1-snippet="p1Snippet"
              @solved="onTaskSolved"
              @p1-solved="onTaskSolved"
              @p2-solved="onTaskSolved"
              @task-solved="onTaskSolved"
              @task-failed="onTaskFailed"
              @failed="onTaskFailed"
            />
          </div>

          <div v-else-if="task" class="task-box">
            <div class="box-label">// ACTIVE_TASK</div>
            <h2 class="task-text">{{ task.instruction }}</h2>
            <div class="task-sub">TARGET: {{ task.target }} | VALUE: {{ task.value }}</div>
          </div>

          <div v-if="wartet" class="task-box">
            <div class="box-label">// TASK_STATUS</div>
            <h2 class="task-text">Geschafft. Warte auf deinen Partner...</h2>
          </div>

          <div v-if="showDebug" class="action-box">
            <div class="debug-label">// DEBUG_TEST_PANEL</div>
            <button class="cyber-btn debug-btn" @click="currentTask = (currentTask % 3) + 1">
              [ DEBUG: NÄCHSTE AUFGABE ({{ currentTask }} -> {{ (currentTask % 3) + 1 }}) ]
            </button>
          </div>

          <div v-if="!currentTaskComponent && !task" class="action-box">
            <div class="box-label">// PLAYER_INPUT_CONTROLS</div>
            <button
              class="cyber-btn action-btn"
              :disabled="!isConnected || isCooldown || status !== 'running'"
              @click="sendAction"
            >
              <template v-if="status !== 'running'">[ WARTE AUF SPIELSTART... ]</template>
              <template v-else-if="isCooldown">[ COOLING DOWN... ]</template>
              <template v-else>[ EXECUTE: REACTOR VENT ]</template>
            </button>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'manual'" class="tab-content">
      </div>
    </div>

    <!-- Eingeloggt -->
    <template v-else>
      <header class="client-bar">
        <span class="client-name">{{ playerName }}</span>
        <span class="client-role">{{ playerRole }}</span>
        <span class="client-stats">{{ hp }} HP · {{ zeit }}</span>
      </header>

      <main class="client-main">
        <section v-if="status !== 'running'" class="lobby">
          <h2 class="lobby-title">Verbindung</h2>
          <p class="lobby-count">{{ lobbyPlayers.length }} / 3</p>

          <ul class="lobby-list">
            <li v-for="(p, idx) in lobbyPlayers" :key="idx" class="lobby-item">
              {{ typeof p === 'object' ? p.name || p.playerName : p }}
            </li>
            <li v-for="n in (3 - lobbyPlayers.length)" :key="'e' + n" class="lobby-item empty">
              wartet
            </li>
          </ul>
        </section>

        <div v-else class="task-slot">
          <component
            :is="currentTaskComponent"
            :key="currentTask"
            :role="normalizedRole"
            :task="task"
            :symbole="task1Switches"
            :code-length="task1CodeLength"
            :valves="task2Valves"
            :colors="task2Colors"
            :sequence-len="task2SequenceLen"
            :step="task2Step"
            :last-fragment="task2LastFragment"
            :fragments="task2Fragments"
            :p1-done="task2P1Done"
            :p2-done="task2P2Done"
            :ascii-codes="task3Ascii"
            :binary-codes="task3Binary"
            :server-error="lastError"
            @solved="onTaskSolved"
            @task-failed="onTaskFailed"
            @failed="onTaskFailed"
          />
        </div>
      </main>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useGameSocket } from '../composables/useGameSocket.js'
import GameOver from './GameOver.vue'

import Task1P1 from './tasks/task1/Task1P1.vue'
import Task1P2 from './tasks/task1/Task1P2.vue'
import Task2P1 from './tasks/task2/Task2P1.vue'
import Task2P2 from './tasks/task2/Task2P2.vue'
import Task3P1 from './tasks/task3/Task3P1.vue'
import Task3P2 from './tasks/task3/Task3P2.vue'

const WS_BASE = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.hostname}:8000/ws/game/`
const MAX_HP = 300

const gameId = ref('')
const playerName = ref('')
const playerRole = ref('FI-SI')
const hasJoined = ref(false)
const lobbyPlayers = ref([])
const status = ref('waiting')
const hp = ref(MAX_HP)
const timeLeft = ref(300)
const task = ref(null)
const currentTask = ref(1)
const isGameOver = ref(false)
const gameOverResult = ref('meltdown')
const gameOverScore = ref(0)
const gameOverSurvived = ref(0)
const lastError = ref('')

const normalizedRole = computed(() => {
  if (playerRole.value === 'FI-SI') return 'P1'
  if (playerRole.value === 'FI-AE') return 'P2'
  return playerRole.value
})

const currentTaskComponent = computed(() => {
  const map = {
    '1-P1': Task1P1, '1-P2': Task1P2,
    '2-P1': Task2P1, '2-P2': Task2P2,
    '3-P1': Task3P1, '3-P2': Task3P2,
  }
  return map[`${currentTask.value}-${normalizedRole.value}`] || null
})

const task1Switches   = computed(() => task.value?.view?.switches || ['raute', 'dreieck', 'quadrat', 'kreis'])
const task1CodeLength = computed(() => task.value?.view?.code_length || 4)
const task2Valves     = computed(() => task.value?.view?.valves || [])
const task2Colors     = computed(() => task.value?.view?.colors || [])
const task2SequenceLen = computed(() => task.value?.view?.sequence_len || 3)
const task2Step       = computed(() => task.value?.view?.step || 0)
const task2LastFragment = computed(() => task.value?.view?.last_fragment || null)
const task2Fragments  = computed(() => task.value?.view?.fragments || [])
const task2P1Done     = computed(() => task.value?.view?.p1_done || false)
const task2P2Done     = computed(() => task.value?.view?.p2_done || false)
const task3Ascii      = computed(() => task.value?.view?.ascii_codes || [])
const task3Binary     = computed(() => task.value?.view?.binary_codes || [])

const istSpielVorbei = computed(
  () => isGameOver.value || hp.value <= 0 || status.value === 'game_over' || status.value === 'won'
)

const zeit = computed(() => {
  const t = Math.max(0, timeLeft.value)
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
})

watch(currentTask, () => { lastError.value = '' })

function taskNumberFromView(viewType) {
  switch (viewType) {
    case 'alarm_source':
    case 'main_switches':
    case 'shutdown_terminal': return 1
    case 'fire_protocol':
    case 'valve_panel':
    case 'password_input':    return 2
    case 'task3_master':
    case 'task3_p1':
    case 'task3_p2':          return 3
    default:                  return null
  }
}

const handleServerMessage = (msg) => {
  const event = msg?.event || msg?.type
  const payload = msg?.payload || msg

  if (event === 'lobby_update') {
    lobbyPlayers.value = payload.players ?? []
    status.value = payload.status ?? status.value
    if (status.value === 'waiting' || status.value === 'ready') {
      isGameOver.value = false
      hp.value = MAX_HP
      timeLeft.value = 300
      lastError.value = ''
      gameOverResult.value = 'meltdown'
      gameOverScore.value = 0
      gameOverSurvived.value = 0
    }
  }

  if (event === 'role_assigned') playerRole.value = payload.role

  if (event === 'game_tick') {
    if (typeof payload.health === 'number') hp.value = payload.health
    timeLeft.value = payload.time_left ?? timeLeft.value
    task.value = payload.tasks?.[0] ?? task.value

    const n = taskNumberFromView(task.value?.view?.type)
    if (n && n !== currentTask.value) {
      currentTask.value = n
      lastError.value = ''
    }

    if (status.value !== 'running' && status.value !== 'game_over' && status.value !== 'won') {
      status.value = 'running'
    }
    if (hp.value <= 0) { isGameOver.value = true; status.value = 'game_over' }
    hasJoined.value = true
  }

  if (event === 'input_result') {
    if (payload.result === 'wrong') {
      lastError.value = 'Falsche Eingabe'
      if (typeof payload.health === 'number') hp.value = payload.health
      if (hp.value <= 0) { isGameOver.value = true; status.value = 'game_over' }
    } else {
      lastError.value = ''
    }
  }

  if (event === 'game_over') {
    isGameOver.value = true
    gameOverResult.value = payload.result || 'meltdown'
    gameOverScore.value = payload.score || 0
    gameOverSurvived.value = payload.survived_seconds || 0
    status.value = gameOverResult.value === 'victory' ? 'won' : 'game_over'
  }
}

const { connect, sendEvent } = useGameSocket({
  url: WS_BASE, onMessage: handleServerMessage,
})

const handleJoin = () => {
  const id = gameId.value.trim().toLowerCase()
  const name = playerName.value.trim()
  if (!id || !name || hasJoined.value) return
  hasJoined.value = true
  connect(`${WS_BASE}${id}/`, handleServerMessage, () => {
    sendEvent('player_register', { player_name: name })
  })
}

const onTaskFailed = () => {
  sendEvent('player_input', { action_type: 'button_press', target: 'penalty', value: 'wrong' })
}

const onTaskSolved = (data) => {
  let payloadData = {}

  if (currentTask.value === 1) {
    if (normalizedRole.value === 'P1') {
      payloadData = { action_type: 'button_press', target: 'main_switch', value: data?.value || '' }
    } else {
      const codeStr = Array.isArray(data?.code) ? data.code.join(',') : (data?.code || data?.value || '')
      payloadData = { action_type: 'text_input', target: 'shutdown_cmd', value: codeStr }
    }
  } else if (currentTask.value === 2) {
    if (normalizedRole.value === 'P1') {
      payloadData = { action_type: 'button_press', target: 'valve_action',
                      value: `${data?.valve || ''}:${data?.color || ''}` }
    } else {
      payloadData = { action_type: 'text_input', target: 'release_pw', value: data?.password || '' }
    }
  } else if (currentTask.value === 3) {
    if (normalizedRole.value === 'P1') {
      payloadData = { action_type: 'text_input', target: 'ascii_answer', value: data?.answer || '' }
    } else {
      payloadData = { action_type: 'text_input', target: 'binary_answer', value: data?.answer || '' }
    }
  }

  lastError.value = ''
  if (payloadData.target) sendEvent('player_input', payloadData)
}
</script>

<style scoped>
.client {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow: hidden;
}

/* Verbinden */
.connect {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.connect-card {
  width: 100%;
  max-width: 380px;
  background: var(--bg-1);
  border: 1px solid var(--border-2);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.connect-title {
  font-family: var(--mono);
  font-size: 18px;
  font-weight: 700;
  color: var(--fg);
  margin: 0;
  letter-spacing: 0.05em;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--fg-3);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.input {
  width: 100%;
  padding: 12px 14px;
  background: var(--bg);
  color: var(--fg);
  border: 1px solid var(--border-2);
  font-family: var(--mono);
  font-size: 14px;
  outline: none;
}

.input:focus { border-color: var(--green-border); }

.btn-connect {
  padding: 14px;
  background: var(--green);
  color: #050a08;
  border: none;
  font-family: var(--mono);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.1em;
  transition: background 0.15s;
}

.btn-connect:hover:not(:disabled) { background: #4dff8f; }

.btn-connect:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* Bar */
.client-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: var(--bg-1);
  border: 1px solid var(--border);
  font-family: var(--mono);
  font-size: 12px;
}

.client-name {
  color: var(--fg);
  font-weight: 600;
}

.client-role {
  color: var(--green);
  padding: 2px 8px;
  border: 1px solid var(--green-border);
  letter-spacing: 0.05em;
}

.client-stats {
  margin-left: auto;
  color: var(--fg-2);
}

/* Main */
.client-main {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  overflow-y: auto;
}

/* Lobby */
.lobby {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
}

.lobby-title {
  font-family: var(--mono);
  font-size: 16px;
  font-weight: 700;
  color: var(--fg);
  margin: 0;
  letter-spacing: 0.05em;
}

.lobby-count {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--green);
  margin: 0;
  letter-spacing: 0.1em;
}

.lobby-list {
  list-style: none;
  padding: 0;
  margin: 16px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.lobby-item {
  padding: 14px 18px;
  background: var(--bg-1);
  border: 1px solid var(--border-2);
  font-family: var(--mono);
  font-size: 14px;
  color: var(--fg);
}

.lobby-item.empty {
  color: var(--fg-3);
  border-style: dashed;
}

/* Task slot */
.task-slot {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
</style>