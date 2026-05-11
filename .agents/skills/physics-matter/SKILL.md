---
name: physics-matter
description: "Nutze diesen Skill für Phaser Matter Physics: komplexe Bodies, Polygone, Constraints, Sensoren, Joints und realistischere Simulation."
---

# Phaser Matter Physics

**Verwandte Skills:** ../physics-arcade/SKILL.md

> Matter Physics eignet sich für komplexe Formen, Constraints, Gelenke und physikalischere Simulation.

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

- Matter Physics eignet sich für komplexe Formen, Constraints, Gelenke und physikalischere Simulation.
- Nutze Matter nur, wenn Arcade die Mechanik nicht sauber abbildet.
- Bodies können Sensoren sein, ohne physisch zu blockieren.
- Setze Collision Categories und Masks bewusst.
- Arcade- und Matter-Bodies interagieren nicht direkt miteinander.

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

- https://docs.phaser.io/phaser/concepts/physics
