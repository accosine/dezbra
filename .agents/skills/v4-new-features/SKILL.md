---
name: v4-new-features
description: "Nutze diesen Skill für neü Phaser-4-Funktionen: Filter, neü Actions, Renderer-änderungen, API-Erweiterungen und moderne Projektpatterns."
---

# Neü Funktionen in Phaser 4

**Verwandte Skills:** ../v3-to-v4-migration/SKILL.md

> Phaser 4 erweitert besonders Rendering, Filter/PostFX und verschiedene Utility-Bereiche.

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

- Phaser 4 erweitert besonders Rendering, Filter/PostFX und verschiedene Utility-Bereiche.
- Nutze neue Features nur, wenn sie einen konkreten Vorteil bringen.
- Beachte WebGL-/Canvas-Unterschiede und prüfe Fallbacks.
- Halte Skill- und Codebeispiele kompatibel mit der im Projekt installierten Phaser-Version.
- Details in `references/REFERENCE.md` sammeln, wenn ein Feature projektrelevant wird.

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

- https://docs.phaser.io/phaser/concepts/game
