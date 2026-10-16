// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HostScreen from '../src/components/HostScreen.vue'
import { 
  simulateMessage, 
  resetGameSocketMock 
} from './mocks/useGameSocket.js'

// EXTREM WICHTIG: Leitet alle Imports des echten Composables auf deine Mock-Datei um
vi.mock('../src/composables/useGameSocket.js', () => import('./mocks/useGameSocket.js'))

describe('HostScreen.vue (mit Fake-WebSocket)', () => {
  beforeEach(() => {
    resetGameSocketMock()
  })

  it('test_host_screen_shows_game_over — nach game_over Countdown weg, Overlay da', async () => {
    const wrapper = mount(HostScreen)

    // Event über den Mock einspeisen
    simulateMessage({
      type: 'game_over'
    })

    await wrapper.vm.$nextTick()

    // Prüfen, ob Game Over Overlay vorhanden ist
    expect(wrapper.find('.game-over-banner').exists()).toBe(true)
    expect(wrapper.find('.content-section').exists()).toBe(false)
  })
})