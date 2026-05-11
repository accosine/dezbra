---
name: game-setup-and-config
description: "Nutze diesen Skill für Phaser Game-Konfiguration, Renderer, Parent, Scale, Plugins, Physiksysteme und Projektstart."
---

# Phaser Game-Setup und Konfiguration

**Verwandte Skills:** ../scenes/SKILL.md, ../scale-and-responsive/SKILL.md

> Erzeuge normalerweise genau eine `Phaser.Game`-Instanz.

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

- Erzeuge normalerweise genau eine `Phaser.Game`-Instanz.
- `type: Phaser.AUTO` ist der Standard, wenn Canvas oder WebGL nicht erzwungen werden muss.
- Setze `parent`, `width`, `height`, `backgroundColor`, `scale`, `scene` und optional `physics` zentral.
- Aktiviere nur benötigte Plugins und Physiksysteme.
- Trenne Game-Config von Szenenlogik, sobald das Projekt wächst.

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
