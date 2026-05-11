---
name: audio-and-sound
description: "Nutze diesen Skill für Phaser-Audio: Sound Manager, Web Audio, HTML5 Audio, Musik, Effekte, Marker, Audio Sprites und Szenenwechsel."
---

# Phaser Audio und Sound

**Verwandte Skills:** ../loading-assets/SKILL.md, ../events-system/SKILL.md

> Phasers Sound Manager ist global. Sounds stoppen beim Szenenwechsel nicht automatisch und Browser verlangen oft eine Nutzerinteraktion vor der ersten Wiedergabe.

## Schnellstart

```js
this.load.audio("hit", ["audio/hit.mp3", "audio/hit.ogg"]);

this.sound.play("hit", { volume: 0.45 });

const music = this.sound.add("music", { loop: true, volume: 0.6 });
music.play();
this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => music.stop());
```

## Grundregeln

Lade Audio im Loader und spiele es über `this.sound`. Für kurze Effekte reicht `this.sound.play(key, config)`. Für Musik oder wiederverwendbare Sounds erstelle eine Instanz mit `this.sound.add(key, config)`.

Prüfe `this.sound.locked`, wenn Audio nicht startet. Viele Browser entsperren Audio erst nach Pointer- oder Keyboard-Input. Reagiere dann auf das Unlock-Event oder starte Audio nach der ersten Nutzeraktion.

## Web Audio und HTML5 Audio

Web Audio ist der bevorzugte Pfad für Mixing, Panning, Rate, Detune und präzisere Kontrolle. HTML5 Audio ist einfacher, aber limitierter und browserabhängiger. Lade mehrere Formate, wenn Zielbrowser variieren. Für viele kurze Clips sind Audio Sprites oder Marker oft performanter als viele Einzeldateien.

## Musik, Effekte und Marker

Verwende Musikinstanzen mit `loop`, `volume` und optionalem Fade über Tweens. Stoppe oder pausiere Musik bewusst bei Szenenwechseln. Für Soundeffekte nutze klare Keys und begrenze parallele Wiedergaben, wenn Spam möglich ist. Marker erlauben Abschnitte innerhalb einer Datei.

## Szenen-Lifecycle

Da der Sound Manager global ist, muss szenengebundener Sound im `shutdown` oder `destroy` gestoppt werden. Globale Musik kann absichtlich weiterlaufen, sollte dann aber zentral verwaltet werden, z. B. in einer Audio-Szene oder einem kleinen Audio-Service.

## Checkliste

- Audio in `preload()` laden.
- Bei Autoplay-Problemen `this.sound.locked` beachten.
- Looppende Sounds beim Szenenende stoppen oder bewusst global halten.
- Volume, Mute und Musikstatus in `registry` oder Settings speichern.
- Keine unbegrenzten parallelen Treffer-Sounds erzeugen.

## Quellen

- https://docs.phaser.io/phaser/concepts/audio
