---
name: groups-and-containers
description: "Nutze diesen Skill für Phaser Groups, Static Groups, Containers, Layers, Objektpools und Display-Listen."
---

# Phaser Groups und Containers

**Verwandte Skills:** ../game-object-components/SKILL.md

> Groups verwalten Objektlisten und eignen sich für Pools und Batch-Operationen.

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

- Groups verwalten Objektlisten und eignen sich für Pools und Batch-Operationen.
- Static Groups sind für unbewegliche Arcade-Physics-Objekte gedacht.
- Containers gruppieren Transformationen und Renderhierarchien, können aber Input und Physik komplizierter machen.
- Layers helfen bei Renderordnung und Kamerafilterung.
- Für viele Projektile oder Gegner: deaktivieren und wiederverwenden statt daürnd erzeugen und zerstören.

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
