# DRV-BOX: Schritterklärung

**Was am Ende entsteht:** DRV-BOX ist ein webbasiertes Multiplayer-Spiel mit einer zentralen Anzeige (Beamer) und mehreren Eingabegeräten (Laptops), die über WebSockets verbunden sind. Die Spieler bilden ein Rettungsteam und müssen gemeinsam einen brennenden Server löschen. Niemand kennt alle Informationen, die Hinweise sind auf die Spieler verteilt. Jeder hat zusätzlich eine Einschränkung (Blinder, Tauber, Stummer). Nur durch ständige Absprache lässt sich der Brand unter Kontrolle bringen.

**Aktueller Stand des Teams:** Wir haben zurzeit **zwei Spieler**. Das MVP wird deshalb für zwei Spieler gebaut (Blinder und Stummer). Im Puffer wird das Spiel danach auf **drei Spieler** erweitert (der Tauber kommt dazu).

**Technik:** Vue.js, HTML und CSS im Frontend, Django (Python) mit WebSockets im Backend, Docker für die Umgebung, Cypress und Postman für Tests, dazu eine strukturierte Dokumentation.

**Terminlogik:** Jeder Montag ist durch ZAB besetzt. Vom 21. bis 25.09. ist Berufsschule. An diesen Tagen und am Wochenende wird nicht gearbeitet.

**Rollen im MVP (2 Spieler):**
- **Blinder:** sieht den brennenden Server auf dem Beamer nicht, hört und spricht aber normal. Er bekommt seine Hinweise über sein Laptop und muss den Server über die Beschreibung des Partners bedienen.
- **Stummer:** sieht den brennenden Server und hört alles, darf aber nicht sprechen. Er kommuniziert nur über feste Signale im Spiel (z. B. Ja/Nein-Buttons, Klopfzeichen-Codes).

---

## Phase 1: Fundament (TDD)

Das graue Setup-Fundament, das gelegt werden muss, bevor die eigentliche Programmierung startet.

### JSON-Verträge & Basis-Setup (15.09.)

**Was zu tun ist:**
- Das Team dokumentiert, wie die Datenpakete exakt aussehen, bevor Code entsteht.
- Dazu gehören die Nachrichten für Lobby-Beitritt, Rollenzuweisung (Blinder, Stummer), Modul-Eingaben, Stummer-Signale und Sieg/Niederlage.
- Die Rollenanzahl wird im Vertrag nicht fest verdrahtet (Liste statt feste Felder), damit später zusätzliche Rollen für bis zu drei Spieler ohne Umbau möglich sind.
- Die leeren Django- und Vue-Projekte werden initialisiert.
- Die Doku-Struktur (z. B. ein `docs/`-Ordner mit den Schnittstellen) wird angelegt.

**Ziel:** Frontend und Backend können unabhängig voneinander programmiert werden, weil die Schnittstelle wie ein bindender Vertrag feststeht.

### Docker/Redis Basis-Setup (Bene) (15.09. – 16.09.)

**Was zu tun ist:**
- Bene schreibt die `docker-compose.yml`, damit Django, Redis und das Frontend in isolierten Containern starten und fehlerfrei miteinander kommunizieren.
- Redis dient als Channel-Layer für die WebSockets und später als Spielstand-Speicher.

**Ziel:** Jeder Entwickler im Team hat mit einem Befehl exakt dieselbe lokale Entwicklungsumgebung.

### TDD: 12 Basis-Tests (Handout) (16.09. – 17.09.)

**Was zu tun ist:**
- Die 12 wichtigsten Kern-Szenarien werden als leere, fehlschlagende Tests (Pytest/Vitest) geschrieben, bevor die Logik existiert.
- Die Szenarien sind z. B. „Spieler tritt Lobby bei", „Zwei Spieler starten das Spiel, ein dritter wird abgelehnt", „Rollen werden ohne Doppelung verteilt", „Falsche Eingabe erzeugt einen Fehler (Strike)" und „Timer läuft ab, der Server brennt ab".
- Zusätzlich wird eine erste Postman-Collection für die REST-Endpunkte (Lobby erstellen/beitreten) angelegt.

**Ziel:** Die Tests sind der rote Faden des Teams und sichern die Entwicklung ab.

---

## Phase 2: Core-Loop (MVP)

Der kritische Pfad. Hier entsteht die Kernfunktionalität des Spiels.

### Lobby & Redis-State (Backend) (18.09. & 29.09.)

**Was zu tun ist:**
- Das Backend stellt Endpunkte bereit, um eine Spielsitzung zu erzeugen und beizutreten. Die Lobby ist im MVP auf zwei Spieler ausgelegt.
- Die zwei Rollen (Blinder, Stummer) werden den Spielern zugewiesen.
- Der Spielstand (wer ist im Spiel, welche Rolle, wie viele Strikes, wie viel Zeit) liegt performant in Redis.
- Die Hinweise zum brennenden Server werden so auf die zwei Spieler aufgeteilt, dass keiner alles weiß.

**Hinweis:** Zwischen den beiden Tagen liegen Berufsschule und ZAB-Montag.

### Vue Host/Client UI (Frontend) (18.09. & 29.09.)

**Was zu tun ist:**
- Es gibt zwei Ansichten: den **Host** (Beamer mit brennendem Server, Countdown und Strike-Anzeige) und den **Client** (Bedienfeld auf dem Laptop jedes Spielers).
- Die Client-Ansicht berücksichtigt die Einschränkung der Rolle: Beim Blinden ist die Serveransicht ausgeblendet, beim Stummen gibt es statt Sprechen die festen Signal-Buttons.
- Alles läuft zunächst nur mit statischen Dummy-Daten.

**Hinweis:** Läuft parallel zur Lobby, also auf zwei Tage verteilt wie oben.

### Async Tick-Schleife (Backend) (30.09. – 01.10.)

**Was zu tun ist:**
- Im Backend startet ein asynchroner Hintergrundprozess in Django Channels.
- Diese Schleife ist der „Herzschlag" des Brands: Sie zählt den Timer herunter und verteilt jede Sekunde den Tick an alle Geräte.
- Sie löst den Totalschaden aus, wenn die Zeit abläuft (der Server ist abgebrannt).

### WS-Integration Vue (Frontend) (02.10. & 06.10.)

**Was zu tun ist:**
- Das Frontend wird live mit dem Backend verbunden. Die Vue-App baut die WebSocket-Verbindung auf.
- Der Beamer reagiert live auf die Ticks. Die beiden Laptops senden ihre Eingaben und die Signale des Stummen über den WebSocket an den Server.
- Jeder Client zeigt nur die Informationen seiner Rolle an.

**Hinweis:** Der 05.10. ist ZAB, deshalb sind es zwei Arbeitstage mit Pause dazwischen.

---

## Phase 3: Stabilität (MVP)

Das MVP wird abgerundet, spielbar gemacht und gegen Fehler abgesichert.

### Task-Validierung & Punkte (07.10. – 08.10.)

**Was zu tun ist:**
- Die Logik für Löschen und Abbrand: Das Backend prüft, ob die Eingabe zur Lösung passt, die sich aus den verteilten Hinweisen ergibt.
- Richtige Eingabe: Modul gilt als gelöscht bzw. stabilisiert. Falsche Eingabe: Strike. Bei zu vielen Strikes oder abgelaufener Zeit ist das Spiel verloren.
- Pydantic validiert ungültige Eingaben (Hacker- oder Fehlbedienung).
- Die Postman-Tests werden um Validierungsfälle ergänzt.

### Redis-Locks & Spam-Schutz (09.10.)

**Was zu tun ist:**
- Im Backend werden Redis-Locks eingebaut, damit der State nicht korrumpiert, wenn beide Spieler in derselben Millisekunde eingeben (Race Condition).
- Das Frontend sperrt einen Button nach dem Klick kurz (z. B. 300 ms), um wildes Spamming zu verhindern.

### LAN-Generalprobe (Alle) (13.10.)

**Was zu tun ist:**
- Das Team verlässt die lokale Entwicklungsumgebung. Beide Laptops und ein echter Beamer werden in einem echten lokalen Netzwerk verbunden.
- Getestet wird, ob die WebSockets auch bei echten Netzwerklatenzen stabil bleiben.
- Zwei Personen spielen mit den echten Rollen (Blind, Stumm) eine komplette Runde.

**Hinweis:** Der 12.10. ist ZAB, deshalb erst am Dienstag.

### MEILENSTEIN: MVP SPIELBAR (Code Freeze) (14.10.)

**Ziel:**
- Abnahme des Kern-Spiels: Der Core-Loop für zwei Spieler funktioniert fehlerfrei, macht Spaß und stürzt nicht ab.
- Die Dokumentation zum Stand des Fundaments (Schnittstellen, Setup, Spielregeln) wird abgeschlossen.
- Der Code wird eingefroren (blauer Meilenstein im Diagramm).

---

## Phase 4: Puffer / Extras

Die blau umrandeten Blöcke. Diese Features werden nur umgesetzt, wenn der kritische Pfad (MVP) pünktlich abgeschlossen wurde.

### Erweiterung von 2 auf 3 Spieler (15.10.)

**Was zu tun ist:**
- Zur bestehenden Besetzung (Blinder, Stummer) kommt der **Tauber** (sieht, spricht, hört aber nichts) dazu.
- Der Zuweisungsalgorithmus im Backend wird angepasst, damit Rollen und Hinweise dynamisch auf drei Spieler verteilt werden.
- Die Lobby lässt bis zu drei Spieler zu.
- Das Beamer-Layout wird erweitert, um Platz für alle Spieler zu schaffen.

**Hinweis:** Weil die JSON-Verträge und die Lobby von Anfang an mit einer Rollenliste arbeiten, ist das eine Erweiterung und kein Umbau.

### PostgreSQL & Highscore-DB (15.10. – 16.10.)

**Was zu tun ist:**
- Nach Spielende wird das Ergebnis (Teamname, Restzeit, Strikes) dauerhaft in PostgreSQL gespeichert.
- Das Frontend erhält eine REST-Ansicht für die Highscores.

### Web Audio API (Sounds) (15.10.)

**Was zu tun ist:**
- In Vue wird die native Web Audio API angesprochen: knisterndes Feuer und Alarme, schneller werdendes Knistern bei wenig Zeit, Fehler- und Abbrandgeräusch, mechanische Klicks bei Eingaben.
- Die Töne sind besonders für den Blinden wichtig, weil er den Brand nur hört.

### Cypress E2E Full Happy-Path (15.10. – 16.10.)

**Was zu tun ist:**
- Ein automatisiertes Skript steuert zwei virtuelle Browser fern, tritt der Lobby bei, löst die Module, löscht den brennenden Server und prüft den DB-Eintrag.
- Es beweist der IHK die fehlerfreie Funktion der gesamten Architektur.