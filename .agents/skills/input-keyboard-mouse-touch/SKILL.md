---
name: input-keyboard-mouse-touch
description: "Nutze diesen Skill für Phaser Input: Pointer, Maus, Touch, Tastatur, Drag-and-Drop, Hit Areas und Interaktionszustand."
---

# Phaser Input für Keyboard, Maus und Touch

**Verwandte Skills:** ../events-system/SKILL.md

> Game Objects reagieren erst nach `setInteractive()` auf Pointer.

## Schnellstart

```js
// Beispielstruktur: in preload laden, in create erzeugen, in update nur laufende Logik halten.
preload() {
  // Assets oder Daten laden.
}

create() {
  // Objekte erzeugen, Events verbinden, Zustand initialisieren.
}

update(time, delta) {
  // Zeitbasierte Logik mit delta ausführen.
}
```

## Leitlinien

- Game Objects reagieren erst nach `setInteractive()` auf Pointer.
- Pointer vereinheitlicht Maus, Touch und Stift.
- Tastatur kann über Events oder Polling in `update()` verarbeitet werden.
- Dragging benötigt interaktive Objekte mit `draggable: true` oder `setDraggable`.
- Bei API-Details `references/REFERENCE.md` lesen.

## Arbeitsweise

1. Bestehende Szenen, Assets und Konfiguration prüfen.
2. Das passende Phaser-System verwenden, statt Browser-APIs oder globale Hilfskonstrukte einzubauen.
3. Objekt-Lebensdauer bewusst behandeln: erzeugen, deaktivieren, wiederverwenden oder zerstören.
4. Bei szenengebundenen Ressourcen Listener, Timer, Tweens, Sounds und Effekte beim Szenenende aufräumen.
5. Kleine, nachvollziehbare änderungen bevorzugen und Verhalten im Browser oder per Test verifizieren.

## Checkliste

- Phaser-API-Namen unverändert lassen.
- Szenen-Lifecycle beachten.
- Keine unnötigen globalen Variablen einführen.
- Performance bei vielen Game Objects prüfen.
- Resize, Pause und Szenenwechsel mitdenken.

## Quellen

- https://docs.phaser.io/phaser/concepts/input
