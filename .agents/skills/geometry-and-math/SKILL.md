---
name: geometry-and-math
description: "Nutze diesen Skill für Phaser.Geom, Phaser.Math, Vektoren, Winkel, Distanzen, Zufall, Interpolation und Trefferabfragen."
---

# Phaser Geometrie und Mathematik

**Verwandte Skills:** ../actions-and-utilities/SKILL.md

> `Phaser.Geom` stellt Formen wie Circle, Rectangle, Line, Triangle, Polygon und Ellipse bereit.

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

- `Phaser.Geom` stellt Formen wie Circle, Rectangle, Line, Triangle, Polygon und Ellipse bereit.
- `Phaser.Math` bietet Winkel, Distanzen, Clamp, Snap, Random, Interpolation, Easing und Vektoren.
- Rotation ist meist Radiant; `angle` ist Grad.
- Nutze Geometrie für Spawnpunkte, Sichtbereiche, einfache Hit-Tests und Layout.
- Bei vielen bewegten Kollisionen ist Physics oft besser als manülle Geometriechecks.

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

- https://docs.phaser.io/phaser/concepts/math
