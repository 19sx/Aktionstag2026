# 🔌 WS-Integration: Frontend Backend

Diese Tabelle beschreibt die theoretischen und praktischen Schritte, um die Live-Verbindung zwischen dem Beamer, den Laptops und dem Server herzustellen.

| Schritt | Fokus | Backend-Aufgabe (Django Channels) | Frontend-Aufgabe (Vue.js) | Ziel / Ergebnis |
| :--- | :--- | :--- | :--- | :--- |
| **1. Handshake** | **Verbindung** | `connect()` im `GameConsumer` aufrufen $\rightarrow$ `accept()` $\rightarrow$ Spieler zur `room_group` hinzufügen. | `new WebSocket('ws://...')` aufrufen $\rightarrow$ Verbindung zum Server herstellen. | Stabile WebSocket-Verbindung zwischen Client und Server. |
| **2. Heartbeat** | **Live-Ticks** | `GameLoop` sendet jede Sekunde `game_tick` via `channel_layer.group_send`. | `onmessage` Event abfangen $\rightarrow$ `health` Variable aktualisieren $\rightarrow$ UI (Balken/Zahl) aktualisieren. | Der Beamer und alle Laptops zeigen synchron den ablaufenden Timer. |
| **3. Interaktion** | **Eingaben** | `receive()` im Consumer $\rightarrow$ `event` auswerten $\rightarrow$ an `engine.py` zur Validierung weiterleiten. | Button-Klicks in JSON-Pakete (`player_input`) verpacken $\rightarrow$ via `socket.send()` abschicken. | Aktionen eines Spielers (z.B. Button-Druck) lösen Reaktionen im Spiel aus. |
| **4. Rollen** | **Filterung** | Rollen-Info beim Start an Client senden (z.B. `{ "role": "blind" }`). | Rolle im State speichern $\rightarrow$ UI-Elemente via `v-if` basierend auf der Rolle ein/ausblenden. | Jeder Spieler sieht nur die Informationen, die seiner Rolle entsprechen. |
| **5. Abschluss** | **Spielende** | `game_over` Event an alle senden, wenn Health = 0 oder Sieg erreicht. | Empfang von `game_over` $\rightarrow$ Game-Over-Screen anzeigen $\rightarrow$ Verbindung schließen. | Sauberes Ende der Spielsession für alle Teilnehmer. |

**💡 Wichtigster Punkt:** Die Kommunikation erfolgt strikt nach dem **JSON-Vertrag**. Das Backend sendet nur, was im Vertrag steht, und das Frontend erwartet genau diese Felder.
