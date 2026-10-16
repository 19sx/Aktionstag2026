# Projektübergabe – DRV-BOX

DRV-BOX ist ein webbasiertes kooperatives Multiplayer-Spiel, bei dem drei Spieler gemeinsam einen brennenden Server retten müssen. Die benötigten Informationen und Aufgaben sind auf die Spieler verteilt. Nur durch Kommunikation und Zusammenarbeit können die Aufgaben gelöst und der Server gerettet werden.


## Technischer Aufbau

Das Backend basiert auf Python, Django und Django Channels. Das Frontend wird mit Vue.js 3,tailwind und Vite umgesetzt. Redis dient als Channel-Layer für die WebSockets und zur Verwaltung des temporären Spielzustands. Die Anwendung wird über Docker Compose gestartet. Für Tests werden unter anderem Pytest, Postman und optional Cypress verwendet.

## Ansichten und Rollen

Es gibt drei Spielerrollen sowie eine separate Host-Ansicht für den großen Bildschirm am Präsentationsstand.

- **Master:** Spielt aktiv mit und hat Zugriff auf die Guides für die Aufgaben von Spieler 1 und Spieler 2. Er muss die Anweisungen verstehen und an die beiden Spieler weitergeben.
- **Spieler 1:** Sieht eine Seite des Servers mit den dazugehörigen Aufgaben. Er muss diese mithilfe der Hinweise des Masters bearbeiten.
- **Spieler 2:** Sieht die andere Seite des Servers mit eigenen Aufgaben. Auch er ist auf die Informationen und Anweisungen des Masters angewiesen.
- **Host:** Zeigt den Spielstand auf einem großen Bildschirm bzw. Beamer. Diese Ansicht dient hauptsächlich der Präsentation am Stand und ist nicht als zusätzliche Spielerrolle gedacht.

## Die drei Hauptaufgaben

### 1. Alarm verifizieren

Der Master identifiziert die defekte Komponente und erhält deren Seriennummer. Spieler 1 muss den richtigen Hauptschalter finden und betätigen. Spieler 2 gibt anschließend den passenden Shutdown-Befehl mit der Seriennummer ein.

### 2. Richtiges Löschprotokoll

Der Master kennt das richtige Ventil und die zugehörige Farbe. Spieler 1 betätigt die richtige Kombination und erhält dadurch den letzten Passwort-Schnipsel. Spieler 2 setzt die vorhandenen Passwortteile zusammen und gibt das vollständige Freigabe-Passwort ein.

### 3. Datenrettung

Der Master stellt eine ASCII-Tabelle und binäre Zahlen als Hilfsmittel bereit. Spieler 1 löst ein ASCII-Rätsel, Spieler 2 ein Binär-Rätsel. Beide müssen ihre jeweiligen Buttons freischalten und gleichzeitig drücken, um den Server zu retten.

## Entwicklungsziel und Start

Das Ziel ist zunächst ein stabiles, spielbares MVP mit Lobby, Rollenverteilung, WebSocket-Kommunikation, Timer, Aufgabenvalidierung und Game-Over-Logik. Weitere geplante Erweiterungen sind Highscores über PostgreSQL, Soundeffekte über die Web Audio API und automatisierte End-to-End-Tests.

Das Projekt wird im Hauptverzeichnis mit folgendem Befehl gestartet:

```bash
docker compose up --build -d
```

Wichtige URLs
Frontend: 
```bash
http://localhost:5173/ 
```
Spielsession erstellen: 
```bash
http://localhost:8000/create-game/ 
```

Spiel starten: 
```bash
http://localhost:8000/force-start/
```

Wichtig ist, dass die Aufgaben und der Spielzustand zentral im Backend verwaltet werden und die Kommunikation zwischen Frontend und Backend über den festgelegten JSON-Vertrag erfolgt.