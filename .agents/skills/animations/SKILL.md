---
name: animations
description: "Nutze diesen Skill beim Erstellen und Steürn von Sprite-Animationen in Phaser: Spritesheets, Atlases, AnimationManager, AnimationState, Events und Frame-Callbacks."
---

# Phaser Sprite-Animationen

**Verwandte Skills:** ../sprites-and-images/SKILL.md, ../loading-assets/SKILL.md

> Animationen bestehen aus Frames plus Zeitdaten. Globale Animationen liegen im `AnimationManager`, die Wiedergabe eines Sprites steürt dessen `AnimationState`.

## Schnellstart

```js
this.load.spritesheet("explosion", "explosion.png", {
  frameHeight: 64,
  frameWidth: 64,
});

this.anims.create({
  frameRate: 24,
  frames: this.anims.generateFrameNumbers("explosion", { end: 11, start: 0 }),
  key: "explode",
  repeat: 0,
});

const sprite = this.add.sprite(400, 300, "explosion");
sprite.play("explode");
```

## AnimationManager und AnimationState

`this.anims` gehört zum Game und ist szenenübergreifend. Dort registrierte Animationen sind in allen Szenen verfügbar. `sprite.anims` gehört zu einem einzelnen Sprite und kontrolliert Wiedergabe, Pause, Richtung, Queue und lokale Animationen.

Wenn `sprite.play(key)` aufgerufen wird, sucht Phaser zürst lokal am Sprite und danach global im AnimationManager. Nutze lokale Animationen nur für Spezialfälle, globale Animationen für geteilte Player-, Gegner- oder Effekt-Animationen.

## Frames erzeugen

Für Spritesheets nutze `generateFrameNumbers(textureKey, config)`. Wichtige Optionen sind `start`, `end`, `first` und `frames`.

Für Atlases nutze `generateFrameNames(textureKey, config)`. Wichtige Optionen sind `prefix`, `suffix`, `start`, `end`, `zeroPad` und `frames`. Ohne Config werden alle Frames aus dem Atlas verwendet.

Ein String als `frames`-Wert verwendet alle Frames einer Textur. Setze `sortFrames: false`, wenn Phaser nicht numerisch sortieren soll.

## Wiedergabe

- `play(key, ignoreIfPlaying?)`: Animation starten.
- `playReverse(key)`: rückwärts starten.
- `stop()`, `pause()`, `resume()`: Wiedergabe kontrollieren.
- `chain(keyOrArray)`: Animationen nach Abschluss einreihen.
- `setProgress(value)`: Position in der Animation setzen.
- `repeat: -1`: Endlosschleife; eine Chain startet dann erst nach `stop()`.

## Events und Callbacks

Nutze Events wie `animationstart`, `animationupdate`, `animationrepeat`, `animationcomplete` und `animationstop` für Gameplay-Reaktionen. Für einmalige Reaktionen verwende `once`. Frame-spezifische Callbacks sind sinnvoll für Trefferfenster, Footstep-Sounds oder Partikel, sollten aber nicht zu schwergewichtig sein.

## Checkliste

- Animationen pro Key nur einmal erzeugen.
- `play(key, true)` verwenden, wenn ein laufender State nicht neu starten soll.
- Spritesheet-Frames und Atlas-Frame-Namen prüfen, wenn nichts sichtbar ist.
- Endlosanimationen nicht mit erwarteten `animationcomplete`-Folgen verwechseln.
- Globale Animationen in Boot-/Preload-/Create-Setup zentral registrieren.

## Quellen

- https://docs.phaser.io/phaser/concepts/animations
