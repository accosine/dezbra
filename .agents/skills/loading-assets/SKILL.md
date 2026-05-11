---
name: loading-assets
description: "Nutze diesen Skill für Phaser Loader, Asset-Keys, Preload-Szenen, Texturen, Atlases, Spritesheets, Audio, JSON und dynamisches Nachladen."
---

# Phaser Assets laden

**Verwandte Skills:** ../sprites-and-images/SKILL.md

> Lade Assets in `preload()` mit `this.load`.

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

- Lade Assets in `preload()` mit `this.load`.
- Keys müssen eindeutig und stabil sein.
- In `preload()` startet der Loader automatisch; ausserhalb davon `this.load.start()` verwenden.
- Nutze `load.image`, `load.spritesheet`, `load.atlas`, `load.audio`, `load.json`, `load.tilemapTiledJSON` passend zum Asset.
- Fortschritt und Fehler über Loader-Events behandeln.

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

- https://docs.phaser.io/phaser/concepts/loader
