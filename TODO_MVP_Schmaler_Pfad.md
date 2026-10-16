# TODO – MVP Schmaler Pfad (Code Freeze Freitag)

**Ziel:** Ein durchgängiger Happy Path, mit dem man live spielen kann.  
**Belohnung:** Freitag Nachmittag darf etwas Lustiges gebaut werden — aber erst, wenn dieser Pfad grün ist.

**Definition of Done (DoD):**

1. Spieler registriert sich → Lobby-Update kommt an  
2. Host startet (nicht über `force-start`) → Tick läuft  
3. Host zeigt **live** Health (kein Dummy)  
4. Ein Client-Input → Health runter **oder** Task klar erledigt  
5. Bei 0 HP → `game_over` bei allen Clients

---

## Gemeinsame Regeln

- Kommunikation **strikt nach** `JSON_Vertrag.md` (`event` + `payload`)
- Keine neuen Features außerhalb dieser Liste
- Kleine PRs / Commits, Tests wo schon vorhanden grün halten
- Bei Unklarheit: Vertrag anpassen **und** Frontend + Backend gleichzeitig anpassen

---

## Backend

### B1 – Lobby: `player_register` verdrahten
**Owner:** Backend  
**Was:**
- Im `GameConsumer.receive`: Event `player_register` auswerten
- Über `RedisHandler.register_player` Spieler speichern + Rolle vergeben
- Antwort/Broadcast: `lobby_update` an die Room-Group `game_{game_id}`

**Done wenn:** Zwei Clients joinen dieselbe `game_id` und beide sehen die Spielerliste.

### B2 – Spielstart
**Owner:** Backend  
**Was:**
- Host (oder Endpoint `force-start`) startet den `GameLoop` für eine bestehende `game_id`
- Status in Redis: `waiting` → `running`
- Optional: Event `lobby_update` / Start-Signal an alle

**Done wenn:** Nach Start tickt Health in Redis nach unten.

### B3 – Tick + Game Over (bereits teilweise da – fertigmachen)
**Owner:** Backend  
**Was:**
- `game_tick` Payload an JSON-Vertrag anlehnen (`health`, ggf. `time_left`, `tasks`)
- Bei HP ≤ 0: `game_over` mit `result` / Score-Felder laut Vertrag
- Sicherstellen, dass alle Clients in der Group die Events bekommen

**Done wenn:** Ohne Frontend-Klick stirbt der Server sichtbar nach Zeit/Ticks.

### B4 – Ein Input-Pfad
**Owner:** Backend  
**Was:**
- Event `player_input` im Consumer annehmen
- Minimal-Validierung: z. B. falscher Input → `register_mistake` (−HP), richtiger Input → Task cleared / kleiner HP-Bonus oder neue Task
- Kein volles Rätsel-System nötig — **eine** klare Regel reicht

**Done wenn:** Ein Button-Klick vom Client ändert den Server-State messbar.

### B5 – Manager-Stubs nur soweit nötig
**Owner:** Backend  
**Was:**
- `hostManager` / `multiplayerManager` nur implementieren, was Start + Lobby brauchen
- Keine Extra-Features (Heartbeat-Timeouts etc.), außer sie blockieren den Pfad

**Done wenn:** Die für B1–B4 nötigen Tests laufen (Rest darf noch rot sein, klar markieren).

---

## Frontend

### F1 – JSON-Vertrag im Socket angleichen
**Owner:** Frontend  
**Was:**
- Incoming: `event` + `payload` parsen (nicht nur `type`)
- Outgoing: `player_register`, `player_input` laut Vertrag senden
- Alias/Übergang ok, aber Vertrag ist Quelle der Wahrheit

**Done wenn:** Host + Client reagieren auf Backend-Events ohne Format-Hacks.

### F2 – Client: Join + Register
**Owner:** Frontend  
**Was:**
- Nach Game-ID-Eingabe: WS verbinden + `player_register` mit Spielernamen senden
- `lobby_update` anzeigen (Namen / ready)
- Health aus `game_tick` live anzeigen (bereits teilweise vorhanden – an Vertrag anbinden)

**Done wenn:** Zwei Browser zeigen dieselbe Lobby und denselben HP-Stand.

### F3 – Host: Live statt Dummy
**Owner:** Frontend  
**Was:**
- Dummy-Lebensbalken entfernen / durch echte `game_tick`-Daten ersetzen
- `game_over` Screen aus echtem Event
- Game-ID sichtbar machen (zum Teilen an Clients)

**Done wenn:** Beamer/Host-Screen tickt synchron mit dem Backend.

### F4 – Ein Action-Button
**Owner:** Frontend  
**Was:**
- Button sendet `player_input` (einfaches Payload laut Vertrag)
- Feedback: Erfolg/Fehler oder einfach HP-Änderung sichtbar
- Button kurz disablen nach Klick (Spam-Schutz light, ~300ms)

**Done wenn:** Klick → Backend reagiert → UI aktualisiert sich.

---

## Integration (beide)

### I1 – Happy-Path manuell durchspielen
**Owner:** Alle (Pairing empfohlen)  
**Ablauf:**
1. Backend + Redis starten (`docker compose` oder lokal)
2. `force-start` **oder** Host-Start → `game_id` notieren
3. Host-UI öffnen, Client 1 + Client 2 joinen
4. Register → Lobby sichtbar
5. Tick läuft, HP sinkt am Host
6. Ein Input → State ändert sich
7. Bis 0 HP → Game Over überall

**Done wenn:** Der Ablauf einmal ohne DevTools-Zauber durchläuft.

### I2 – Kurz dokumentieren
**Owner:** Beliebig (1 Person)  
**Was:**
- In `readme.md` oder kurzer Abschnitt: „So startet man den Happy Path“ (3–6 Befehle)
- Welche URL / welcher Endpoint / welche Game-ID

**Done wenn:** Ein Teammitglied, das den Tag nicht am Code war, den Pfad in &lt;10 Min nachstellen kann.

---

## Explizit **nicht** für den Freeze

- Schönes Extra-UI, Sounds, Animationen
- 3./4. Spieler, Blind/Taub/Stumm-Vollmechanik
- PostgreSQL / Highscores
- Cypress E2E Full Suite
- Redis-Locks / Race-Condition-Perfektion

→ Das ist Freitag-Nachmittag-Belohnung / Phase 4.

---

## Checkliste Freitag Vormittag

- [ ] B1 Lobby Register
- [ ] B2 Spielstart
- [ ] B3 Tick + Game Over vertragskonform
- [ ] B4 Ein Input
- [ ] F1 Vertrag angleichen
- [ ] F2 Client Join + Register
- [ ] F3 Host live
- [ ] F4 Action-Button
- [ ] I1 Happy Path einmal durchgespielt
- [ ] I2 Start-Anleitung aktuell

**Wenn alle Haken gesetzt sind → Freitag Nachmittag: Spaß-Features frei.**
