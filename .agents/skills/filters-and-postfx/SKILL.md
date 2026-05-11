---
name: filters-and-postfx
description: "Nutze diesen Skill für Phaser Filter, Pre-FX, Post-FX, Kameräffekte, WebGL-Einschränkungen und visülles Feedback."
---

# Phaser Filter und PostFX

**Verwandte Skills:** ../cameras/SKILL.md, ../sprites-and-images/SKILL.md

> FX sind für visuelles Feedback gedacht, nicht für Gameplay-Zustand.

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

- FX sind für visülles Feedback gedacht, nicht für Gameplay-Zustand.
- Pre-FX wirken vor dem Rendern eines texturbasierten Game Objects.
- Post-FX wirken nach dem Rendern auf Game Objects oder Kameras.
- Viele FX sind WebGL-only; prüfe Renderer-Annahmen oder baü Fallbacks.
- Entferne laufende Effekte, wenn Objekte gepoolt oder zerstört werden.

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

- https://docs.phaser.io/phaser/concepts/fx
