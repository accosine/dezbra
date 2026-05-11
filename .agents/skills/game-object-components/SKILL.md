---
name: game-object-components
description: "Nutze diesen Skill für Phaser Game-Object-Komponenten wie Transform, Alpha, BlendMode, Depth, Origin, ScrollFactor, Tint, Data und Visibility."
---

# Phaser Game-Object-Komponenten

**Verwandte Skills:** ../sprites-and-images/SKILL.md

> Game Objects bestehen aus Komponenten. Nicht jedes Objekt unterstützt jede Komponente.

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

- Game Objects bestehen aus Komponenten. Nicht jedes Objekt unterstützt jede Komponente.
- `x`, `y`, `scale`, `rotation`, `angle`, `alpha`, `depth`, `visible`, `active` und `origin` sind typische Steürpunkte.
- `active` beeinflusst Update-Logik, `visible` beeinflusst Rendering.
- `destroy()` ist endgültig; für Pools lieber deaktivieren und verstecken.
- Siehe `references/REFERENCE.md` für kompakte Komponentenliste.

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
