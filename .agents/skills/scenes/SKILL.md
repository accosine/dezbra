---
name: scenes
description: "Nutze diesen Skill für Phaser Scenes, Lifecycle, parallele Szenen, Start/Pause/Sleep/Wake, Scene-Daten und übergänge."
---

# Phaser Szenen

**Verwandte Skills:** ../game-setup-and-config/SKILL.md, ../events-system/SKILL.md

> Szenen sind die fachlichen Laufzeitbereiche eines Phaser-Spiels.

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

- Szenen sind die fachlichen Laufzeitbereiche eines Phaser-Spiels.
- Lifecycle: `init`, `preload`, `create`, `update`, `shutdown`, `destroy`.
- Nutze Boot/Preload/Play/UI/Menu als klare Struktur.
- Szenen können parallel laufen, pausieren, schlafen oder gestoppt werden.
- Scene-Daten werden bei `start` oder `launch` übergeben.

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

- https://docs.phaser.io/phaser/concepts/scenes
