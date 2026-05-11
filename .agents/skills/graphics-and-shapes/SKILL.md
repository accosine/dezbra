---
name: graphics-and-shapes
description: "Nutze diesen Skill für Phaser Graphics, Shape Game Objects, Linien, Rechtecke, Kreise, Polygone, Fills, Strokes und Debug-Visualisierung."
---

# Phaser Graphics und Shapes

**Verwandte Skills:** ../geometry-and-math/SKILL.md

> `Graphics` ist ein Zeichenkontext für dynamische Linien und Flächen.

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

- `Graphics` ist ein Zeichenkontext für dynamische Linien und Flächen.
- Shape Game Objects wie Rectangle, Circle, Arc oder Polygon sind eigenständige Objekte.
- Nutze Graphics für Debug, dynamische Overlays und komplexe Zeichnungen.
- Nutze Shapes für einfache interaktive oder transformierbare Formen.
- Leere oder aktualisiere Graphics bewusst mit `clear()`, statt pro Frame neü Objekte zu erzeugen.

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

- https://docs.phaser.io/phaser/concepts/display
