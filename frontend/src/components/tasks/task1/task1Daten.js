// Feste Daten für Task 1, bis das Backend sie schickt.
// Master, P1 und P2 lesen alle von hier, damit alles zusammenpasst.
const komponenten = [
  { id: 'K1', label: 'NETZWERK-SWITCH 2', symbol: 'raute' },
  { id: 'K2', label: 'HAUPT-STROM B-04', symbol: 'dreieck' },
  { id: 'K3', label: 'LÜFTUNG SYSTEM A', symbol: 'quadrat' },
  { id: 'K4', label: 'FIREWALL-MODUL', symbol: 'kreis' }
]
const defektId = 'K4'

export const TASK1_DATEN = {
  komponenten,
  defektId,
  symbole: komponenten.map((k) => k.symbol),
  richtigesSymbol: komponenten.find((k) => k.id === defektId).symbol,
  code: ['dreieck-runter', 'kreuz', 'dreieck-runter-voll', 'stern']
}