---
name: time-and-timers
description: "Nutze diesen Skill für Phaser Time, Clock, TimerEvent, delayedCall, Loops, TimeScale, Pause und zeitbasierte Spiellogik."
---

# Phaser Zeit und Timer

**Verwandte Skills:** ../tweens/SKILL.md, ../scenes/SKILL.md

> Nutze `this.time` statt Browser-`setTimeout` oder `setInterval`.

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

- Nutze `this.time` statt Browser-`setTimeout` oder `setInterval`.
- `delayedCall` ist für einmalige Verzögerungen.
- `addEvent` mit `loop` oder `repeat` ist für wiederholte Abläufe.
- `timeScale` verlangsamt oder beschleunigt szenengebundene Zeit.
- Timer mit `delay: 0` und Repeat/Loop vermeiden.

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

- https://docs.phaser.io/phaser/concepts/time
