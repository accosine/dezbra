# Szenen - Referenz

## Lifecycle

1. `init(data)`: eingehende Daten und leichte Initialisierung.
2. `preload()`: Loader-Queue füllen.
3. `create(data)`: Objekte und Listener erzeugen.
4. `update(time, delta)`: Frame-Logik.
5. `shutdown`: Szene stoppt oder wechselt.
6. `destroy`: Szene wird zerstört.

## Scene Plugin

Wichtige Methoden: `start`, `launch`, `stop`, `pause`, `resume`, `sleep`, `wake`, `switch`, `bringToTop`, `sendToBack`, `get`.
