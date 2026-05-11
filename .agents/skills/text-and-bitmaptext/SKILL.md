---
name: text-and-bitmaptext
description: "Nutze diesen Skill für Phaser Text, BitmapText, dynamische Labels, HUD, Fonts, Stil, Auflösung und Performance."
---

# Phaser Text und BitmapText

**Verwandte Skills:** ../scale-and-responsive/SKILL.md

> `Text` nutzt Canvas-Texturen und ist flexibel.

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

- `Text` nutzt Canvas-Texturen und ist flexibel.
- `BitmapText` nutzt vorbereenderte Glyphen und ist bei vielen Labels oft performanter.
- ändere Textinhalte nicht unnötig in jedem Frame.
- Setze Schriftstil, Farbe, Stroke, Shadow, Align und WordWrap bewusst.
- Für UI bei Resize Positionen neu berechnen.

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

- https://docs.phaser.io/phaser/concepts/gameobjects
