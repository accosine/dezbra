---
name: scale-and-responsive
description: "Nutze diesen Skill für Phaser Scale Manager, responsive Layouts, FIT, RESIZE, EXPAND, Parent-Grössen und Resize-Events."
---

# Phaser Scale und Responsive Layout

**Verwandte Skills:** ../cameras/SKILL.md, ../game-setup-and-config/SKILL.md

> `Phaser.Scale.FIT` erhält eine feste Designauflösung und ist oft der beste Standard.

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

- `Phaser.Scale.FIT` erhält eine feste Designauflösung und ist oft der beste Standard.
- `RESIZE` folgt dem Parent frei und verlangt responsive Kameras und UI.
- `EXPAND` erlaubt mehr sichtbare Fläche.
- `CENTER_BOTH` zentriert den Canvas.
- Reagiere auf `this.scale.on("resize", ...)` für HUD und Kamera.

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

- https://docs.phaser.io/phaser/concepts/scale-manager
