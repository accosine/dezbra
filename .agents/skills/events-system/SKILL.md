---
name: events-system
description: "Nutze diesen Skill für Phaser-Events, EventEmitter, Scene-Events, globale Events, Listener-Aufräumen und Cross-Scene-Kommunikation."
---

# Phaser Event-System

**Verwandte Skills:** ../scenes/SKILL.md, ../data-manager/SKILL.md

> Phaser nutzt EventEmitter an vielen Stellen: Szenen, Loader, Input, Animationen, Tweens, Sound und Registry.

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

- Phaser nutzt EventEmitter an vielen Stellen: Szenen, Loader, Input, Animationen, Tweens, Sound und Registry.
- Verwende `on` für dauerhafte Listener und `once` für einmalige Reaktionen.
- Entferne eigene Listener mit denselben Funktionsreferenzen und Kontexten über `off`.
- Nutze `this.events` für lokale Szene, `this.game.events` für globale Kommunikation und eigene Namespaces wie `hud:score`.

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

- https://docs.phaser.io/phaser/concepts/events-system
