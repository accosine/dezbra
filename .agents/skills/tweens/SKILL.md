---
name: tweens
description: "Nutze diesen Skill für Phaser Tweens, TweenChain, Timelines, Easing, Yoyo, Repeat, Targets und Property-Animationen."
---

# Phaser Tweens

**Verwandte Skills:** ../time-and-timers/SKILL.md

> Tweens animieren Properties über Zeit.

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

- Tweens animieren Properties über Zeit.
- Targets können Game Objects, Kameras, Soundinstanzen oder einfache Objekte sein.
- Nutze `duration`, `delay`, `ease`, `yoyo`, `repeat`, `hold`, `repeatDelay` und Callbacks bewusst.
- Tweens sind szenengebunden und sollten beim Objekt-Pooling beendet oder neu gesetzt werden.
- Für geskriptete Seqünzen TweenChain oder Timeline verwenden.

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

- https://docs.phaser.io/phaser/concepts/tweens
