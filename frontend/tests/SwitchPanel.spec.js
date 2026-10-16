/**
 * Foundation-Test 10: SwitchPanel.vue (reine UI — KEIN Backend nötig).
 *
 * ROSETTA-STEIN:
 * - describe / it ≈ Testklasse / @Test
 * - wrapper.emitted('panel-changed') ≈ „wurde mein Event-Listener aufgerufen?“
 *   In Java hättet ihr oft einen Mock-Listener; hier speichert Vue Test Utils die Emits.
 *
 * Kein WebSocket, kein Django — nur Klick → Event.
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

// PRODUKTIONSCODE: frontend/src/components/SwitchPanel.vue
// Props: { panelId: String }
// Bei Klick auf Button/Checkbox: emit('panel-changed', { id: panelId, value: true })
import SwitchPanel from '@/components/SwitchPanel.vue'

describe('SwitchPanel.vue', () => {
  it('test_switch_panel_emits_event_on_click — panel-changed mit id und value', async () => {
    /**
     * Test 10 — Klick feuert „panel-changed“ mit Payload.
     *
     * Erwartete Payload:
     *   { id: "main_power", value: true }
     *
     * async + await nextTick / trigger:
     *   Vue aktualisiert DOM und Events asynchron.
     *   „await knopf.trigger('click')“ wartet, bis der Klick verarbeitet ist.
     *   (Vergleich Java: nach listener.onClick(...) ist der Aufruf oft schon synchron —
     *    in Vue lieber await nutzen, damit der Test nicht zu früh assertet.)
     *
     * Was ihr implementieren müsst:
     *   - Prop panelId
     *   - Klickbares Element (button oder input[type=checkbox])
     *   - this.$emit / emit('panel-changed', { id: props.panelId, value: true })
     */
    const panel_id_main_power = 'main_power'

    const gemountetes_switch_panel = mount(SwitchPanel, {
      props: { panelId: panel_id_main_power },
    })

    // Passe den Selektor an euer Markup an (button ODER checkbox)
    const klickbares_bedien_element =
      gemountetes_switch_panel.find('button').exists()
        ? gemountetes_switch_panel.find('button')
        : gemountetes_switch_panel.find('input[type="checkbox"]')

    expect(klickbares_bedien_element.exists()).toBe(true)

    await klickbares_bedien_element.trigger('click')

    const ausgeloeste_panel_changed_events =
      gemountetes_switch_panel.emitted('panel-changed')

    expect(ausgeloeste_panel_changed_events).toBeTruthy()
    expect(ausgeloeste_panel_changed_events.length).toBeGreaterThanOrEqual(1)

    // emitted('x')[0] = erstes Event, [0] = erstes Argument der Payload
    const payload_des_ersten_events = ausgeloeste_panel_changed_events[0][0]
    const erwartete_payload = { id: 'main_power', value: true }

    expect(payload_des_ersten_events).toEqual(erwartete_payload)
  })
})
