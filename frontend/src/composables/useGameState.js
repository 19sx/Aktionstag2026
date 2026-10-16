import { reactive } from 'vue'

export function useGameState() {
  const state = reactive({
    status: 'waiting',       // waiting | ready | running | game_over
    players: [],
    readyToStart: false,
    playerName: null,
    role: null,
    hints: {},
    health: null,
    timeLeft: null,
    task: null,              // { task_id, assigned_to_player, instruction }
    lastInputResult: null,   // 'correct' | 'wrong' | 'ignored' (verschwindet nach 1,5 s)
    gameOver: null,          // { result, score, survived_seconds }
    error: null,
  })

  let resultTimer = null

  const handleMessage = ({ event, payload = {} }) => {
    switch (event) {
      case 'lobby_update':
        state.status = payload.status
        state.players = payload.players
        state.readyToStart = payload.ready_to_start
        break
      case 'role_assigned':
        state.playerName = payload.player_name
        state.role = payload.role
        state.hints = payload.hints
        break
      case 'game_tick':
        state.health = payload.health
        state.timeLeft = payload.time_left
        state.task = payload.tasks?.[0] ?? null
        break
      case 'input_result':
        state.lastInputResult = payload.result
        clearTimeout(resultTimer)
        resultTimer = setTimeout(() => (state.lastInputResult = null), 1500)
        break
      case 'game_over':
        state.gameOver = payload
        state.status = 'game_over'
        break
      case 'error':
        state.error = payload.message
        break
      default:
        console.warn('[GAME] Unbekanntes Event:', event)
    }
  }

  return { state, handleMessage }
}