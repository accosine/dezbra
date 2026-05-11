---
name: curves-and-paths
description: "Nutze diesen Skill für Phaser-Kurven, Pfade, PathFollower, Bewegung entlang von Kurven und geometrische Bewegungsmuster."
---

# Phaser Kurven und Pfade

**Verwandte Skills:** ../geometry-and-math/SKILL.md

> Kurven wie `LineCurve`, `QuadraticBezier`, `CubicBezier`, `EllipseCurve` und `SplineCurve` beschreiben mathematische Pfade.

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

- Kurven wie `LineCurve`, `QuadraticBezier`, `CubicBezier`, `EllipseCurve` und `SplineCurve` beschreiben mathematische Pfade.
- Nutze `Path` für zusammengesetzte Wege und `getPoint`, `getPoints`, `getSpacedPoints`, `getLength` oder `getBounds` für Abfragen.
- PathFollower eignet sich für Game Objects, die einem Pfad mit Tween-Logik folgen sollen.
- Halte Gameplay-Kollisionen getrennt von rein visüller Pfadbewegung.

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

- https://docs.phaser.io/phaser/concepts/curves-and-paths
