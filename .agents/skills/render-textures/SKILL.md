---
name: render-textures
description: "Nutze diesen Skill für Phaser RenderTexture, DynamicTexture, Offscreen-Rendering, Minimap, Spuren, Lichtmasken und Snapshot-artige Effekte."
---

# Phaser RenderTextures

**Verwandte Skills:** ../cameras/SKILL.md, ../sprites-and-images/SKILL.md

> RenderTextures zeichnen Game Objects oder Texturen in eine Zieltextur.

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

- RenderTextures zeichnen Game Objects oder Texturen in eine Zieltextur.
- Nutze sie für Minimap, Malspuren, Nebel, Lichtmasken, Composite-Effekte oder Cache-Bilder.
- Lösche oder überschreibe Inhalte bewusst mit `clear`, `draw`, `erase` oder passenden Blend Modes.
- Beachte Performance bei grossen Texturen und häufigen Draws.
- DynamicTexture eignet sich für global wiederverwendbare dynamische Texturen.

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

- https://docs.phaser.io/phaser/concepts/textures
