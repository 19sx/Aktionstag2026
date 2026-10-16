/**
 * Foundation-Tests 8–9: HealthBar.vue (reine UI — KEIN Backend nötig).
 *
 * ROSETTA-STEIN (Java/JUnit → Vitest):
 * - describe('…', () => { … })  ≈  eine Testklasse
 * - it('…', () => { … })        ≈  eine Methode mit @Test
 * - expect(x).toBe(y)           ≈  assertEquals(y, x)  ← Reihenfolge anders!
 *     JUnit:  assertEquals(erwartet, tatsächlich)
 *     Vitest: expect(tatsächlich).toBe(erwartet)
 *
 * mount(Component, { props }) startet die Vue-Komponente isoliert im Test —
 * vergleichbar mit „new HealthBar(75)“ ohne echten Browser-Server.
 *
 * Diese Tests brauchen KEIN Django und KEIN WebSocket
 * (wie ein JUnit-Unit-Test ohne Datenbank).
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

// PRODUKTIONSCODE: frontend/src/components/HealthBar.vue
// Props: { health: Number }
// Innen z.B. ein Div, dessen Breite health% darstellt; bei health < 20 Klasse „danger“
import HealthBar from '@/components/HealthBar.vue'

describe('HealthBar.vue', () => {
  it('test_health_bar_renders_correct_width — Breite entspricht der Health in Prozent', () => {
    /**
     * Test 8 — Bei health: 75 muss die innere Leiste width: 75% haben.
     *
     * Was ihr implementieren müsst:
     *   - Prop „health“
     *   - Inneres Element (z.B. class=\"health-bar__fill\") mit :style="{ width: health + '%' }"
     *     oder gleichwertig Inline-Style „width: 75%“
     */
    const uebergebene_health = 75

    const gemountete_health_bar = mount(HealthBar, {
      props: { health: uebergebene_health },
    })

    // Suche das Element, das die Breite trägt (passe Selektor an euer Markup an)
    const innere_fortschritts_leiste = gemountete_health_bar.find('.health-bar__fill')

    expect(innere_fortschritts_leiste.exists()).toBe(true)

    const inline_style_der_leiste = innere_fortschritts_leiste.attributes('style') || ''
    expect(inline_style_der_leiste).toContain('width: 75%')
  })

  it('test_health_bar_shows_danger_class_on_low_health — unter 20 kommt Klasse danger', () => {
    /**
     * Test 9 — Bei health: 15 soll die Klasse „danger“ gesetzt sein
     * (z.B. auf dem äußeren oder inneren Div).
     *
     * Was ihr implementieren müsst:
     *   - Wenn health < 20 → CSS-Klasse „danger“ hinzufügen
     *     (z.B. :class="{ danger: health < 20 }")
     */
    const niedrige_health = 15

    const gemountete_health_bar = mount(HealthBar, {
      props: { health: niedrige_health },
    })

    // classes() liefert die Klassen der Root-Komponente; falls „danger“ innen liegt,
    // prüft zusätzlich .health-bar__fill
    const root_hat_danger_klasse = gemountete_health_bar.classes().includes('danger')
    const fill_hat_danger_klasse = gemountete_health_bar
      .find('.health-bar__fill')
      .classes()
      .includes('danger')

    expect(root_hat_danger_klasse || fill_hat_danger_klasse).toBe(true)
  })
})
