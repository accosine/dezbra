---
name: particles
description: "Nutze diesen Skill für Phaser ParticleEmitter, Partikelzonen, Explosionen, Trails, Lifespan, Freqünz, Performance und Pooling."
---

# Phaser Partikel

**Verwandte Skills:** ../sprites-and-images/SKILL.md, ../tweens/SKILL.md

> Partikel sind visülle Effekte für Staub, Feür, Treffer, Glanz und Trails.

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

- Partikel sind visülle Effekte für Staub, Feür, Treffer, Glanz und Trails.
- Emitter-Konfiguration steürt Geschwindigkeit, Winkel, Lifespan, Alpha, Scale, Freqüncy und Quantity.
- Explosive Effekte mit `explode`, Daüremission mit `start` und `stop` steürn.
- Begrenze Partikelzahl und Lebensdauer für Performance.
- Partikel sollen Gameplay unterstützen, nicht verdecken.

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

- https://docs.phaser.io/phaser/concepts/particles
