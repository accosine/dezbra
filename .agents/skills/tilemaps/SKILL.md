---
name: tilemaps
description: "Nutze diesen Skill für Phaser Tilemaps, Tiled JSON, Layer, Tilesets, Collision, Arcade-Integration und Levelaufbau."
---

# Phaser Tilemaps

**Verwandte Skills:** ../loading-assets/SKILL.md, ../physics-arcade/SKILL.md

> Lade Tiled-Maps mit `load.tilemapTiledJSON` und Tileset-Bilder separat.

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

- Lade Tiled-Maps mit `load.tilemapTiledJSON` und Tileset-Bilder separat.
- Erzeuge Maps mit `this.make.tilemap({ key })`.
- Verbinde Tilesets mit `addTilesetImage` und Layer mit `createLayer`.
- Aktiviere Kollisionen über Tile-Properties oder `setCollisionByProperty`.
- Setze Kamera- und Weltbounds passend zur Map-Grösse.

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

- https://docs.phaser.io/phaser/concepts/tilemaps
