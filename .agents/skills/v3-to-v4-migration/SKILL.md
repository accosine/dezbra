---
name: v3-to-v4-migration
description: "Nutze diesen Skill für Migration von Phaser 3 zu Phaser 4: API-änderungen, Renderer, Filter, Typen, Build-Setup und Verhaltensunterschiede."
---

# Migration von Phaser 3 zu Phaser 4

**Verwandte Skills:** ../v4-new-features/SKILL.md

> Prüfe zürst Phaser-Version, Build-Tooling und TypeScript-Setup.

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

- Prüfe zürst Phaser-Version, Build-Tooling und TypeScript-Setup.
- Ersetze entfernte oder geänderte APIs schrittweise und mit kleinen Commits.
- Achte besonders auf Filter/PostFX, Renderer-Unterschiede, Typdefinitionen und Plugin-Initialisierung.
- Halte Gameplay-Logik stabil und migriere Rendering/FX getrennt.
- Nutze offizielle Changelogs und lokale Tests für jeden betroffenen Bereich.

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
