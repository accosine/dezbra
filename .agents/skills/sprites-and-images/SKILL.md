---
name: sprites-and-images
description: "Nutze diesen Skill für Phaser Images, Sprites, Texturen, Frames, Origin, Tint, Flip, Cropping und Sprite-spezifische Patterns."
---

# Phaser Sprites und Images

**Verwandte Skills:** ../loading-assets/SKILL.md, ../animations/SKILL.md

> `Image` ist für statische Texturen, `Sprite` für Animationen.

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

- `Image` ist für statische Texturen, `Sprite` für Animationen.
- Textur-Key und optionaler Frame bestimmen das Bild.
- Setze `origin`, `scale`, `rotation`, `depth`, `alpha`, `tint`, `flipX` und `flipY` bewusst.
- Sprites können AnimationState haben; Images nicht.
- Pooled Sprites deaktivieren und verstecken statt zerstören.

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
