---
name: data-manager
description: "Nutze diesen Skill für Phaser Data Manager, Registry, objektgebundene Daten, Change-Events und saubere Zustandsverwaltung."
---

# Phaser Data Manager

**Verwandte Skills:** ../events-system/SKILL.md

> `this.registry` speichert spielweite Daten.

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

- `this.registry` speichert spielweite Daten.
- `this.data` speichert szenengebundene Daten.
- `gameObject.setData` speichert objektgebundene Daten.
- Nutze `changedata`, `changedata-key`, `setdata` und `removedata` für Reaktionen.
- Vermeide globale Variablen für Spielstand, Optionen und Fortschritt.

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

- https://docs.phaser.io/phaser/concepts/data-manager
