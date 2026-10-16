import { reactive, watch } from 'vue'

const DEFAULT_SETTINGS = {
  displayMode: 'fullscreen',
  brightness: 100,
  masterVolume: 80,
  musicEnabled: true,
  musicVolume: 50,
  voiceChatEnabled: false,
  mouseSensitivity: 1.0
}

// Aus LocalStorage laden falls vorhanden
const saved = localStorage.getItem('drv_game_settings')
const initial = saved ? JSON.parse(saved) : DEFAULT_SETTINGS

export const settings = reactive({ ...initial })

// Wendet Helligkeit direkt aufs Dokument/UI an
export function applyVisualSettings() {
  document.documentElement.style.filter = `brightness(${settings.brightness}%)`
}

// Einstellungen speichern
export function saveSettings(newSettings) {
  Object.assign(settings, newSettings)
  localStorage.setItem('drv_game_settings', JSON.stringify(settings))
  applyVisualSettings()
}

// Reset auf Standard
export function resetSettings() {
  Object.assign(settings, DEFAULT_SETTINGS)
  localStorage.setItem('drv_game_settings', JSON.stringify(DEFAULT_SETTINGS))
  applyVisualSettings()
}

// Bei Programmstart Helligkeit direkt anwenden
applyVisualSettings()