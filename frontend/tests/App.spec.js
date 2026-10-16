// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import App from '../src/App.vue'

// Falls Child-Komponenten WebSockets nutzen, kurz abfangen
vi.mock('../src/composables/useGameSocket.js', () => ({
  useGameSocket: () => ({
    isConnected: true,
    connect: vi.fn(),
    sendEvent: vi.fn()
  })
}))

describe('App.vue', () => {
  // Hilfsfunktion: Klickt uns durch StartMenu & Rollenauswahl bis zur Haupt-App
  async function setupAppWrapper() {
    const wrapper = mount(App, {
      global: {
        stubs: {
          HostScreen: true,
          ClientScreen: true
        }
      }
    })

    // 1. StartMenu triggern (event @spiel-starten simulieren)
    const startMenu = wrapper.findComponent({ name: 'StartMenu' })
    if (startMenu.exists()) {
      await startMenu.vm.$emit('spiel-starten', { name: 'TestPlayer' })
    } else {
      // Falls StartMenu gestubbt ist oder einen Button hat:
      await wrapper.find('button').trigger('click')
    }

    // 2. Rollenauswahl: Auf "HOST" oder "PLAYER" klicken
    await wrapper.find('.host-btn').trigger('click')

    return wrapper
  }

  it('rendert die Header-Elemente und den initialen Tab korrekt', async () => {
    const wrapper = await setupAppWrapper()

    // Brand Text prüfen
    expect(wrapper.find('.brand-text').text()).toContain('DRV-Projekt')

    // Werden die 3 Nav-Links gerendert?
    const links = wrapper.findAll('.nav-link')
    expect(links).toHaveLength(3)

    // Ist der erste Link (init) active?
    expect(links[0].classes()).toContain('active')
  })

  it('wechselt das aktive Modul bei Klick auf einen Navigationslink', async () => {
    const wrapper = await setupAppWrapper()

    const links = wrapper.findAll('.nav-link')

    // Klick auf den zweiten Link (Manual)
    await links[1].trigger('click')

    // Assertions
    expect(links[1].classes()).toContain('active')
    expect(links[0].classes()).not.toContain('active')

    // Prüfen, ob der Inhalt umgeschaltet hat
    expect(wrapper.find('.content-placeholder').text()).toContain('MANUAL')
  })
})