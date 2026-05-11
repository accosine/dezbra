---
name: physics-arcade
description: "Nutze diesen Skill für Phaser Arcade Physics: Bodies, Colliders, Overlaps, Velocity, Gravity, Bounds, Groups und einfache Kollisionen."
---

# Phaser Arcade Physics

**Verwandte Skills:** ../sprites-and-images/SKILL.md

> Arcade Physics ist schnell und einfach, ideal für Platformer, Top-down, Shooter und einfache Kollisionen.

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

- Arcade Physics ist schnell und einfach, ideal für Platformer, Top-down, Shooter und einfache Kollisionen.
- Aktiviere Physics in der Game-Config oder Szene.
- Erzeuge Bodies über `this.physics.add.sprite`, `existing`, `group`, `staticGroup`.
- Nutze `collider` für feste Kollisionen und `overlap` für Trigger.
- Arcade arbeitet primär mit Rechtecken und Kreisen; für komplexe Polygone Matter nutzen.

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

- https://docs.phaser.io/phaser/concepts/physics
