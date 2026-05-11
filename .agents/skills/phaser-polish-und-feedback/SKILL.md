---
name: phaser-polish-und-feedback
description: "Nutze diesen Skill für Phaser-Polish: Animationen, Tweens, Timer, Kameras, Audio, Display-Funktionen, FX, Device-Abfragen, Utils und Feedback-Systeme für Spielgefühl."
---

# Phaser Polish und Feedback

Polish in Phaser entsteht aus koordiniertem Feedback: Sprite-Animationen, Tweens, Kameräffekte, Sound, Farbe, Masken, FX und saubere Zeitsteürung. Implementiere diese Systeme szenengebunden und entferne laufende Effekte, wenn Szenen enden.

## Vorgehen

1. Entscheide pro Feedback, ob es framebasiert, zeitbasiert oder ereignisbasiert ist.
2. Nutze Sprite-Animationen für Framefolgen, Tweens für kontinuierliche Property-änderungen und Timer/Timelines für geplante Abläufe.
3. Nutze Kameras für Weltfeedback wie Shake, Follow, Bounds, Fade, Pan und Zoom.
4. Behandle Audio als globales System: Szenenwechsel stoppen Sounds nicht automatisch.
5. Nutze FX sparsam und prüfe WebGL-Anforderungen.

## Animationen

Framebasierte Animationen gehören zum Animation Manager oder lokal zu einem Sprite. Nicht jedes Game Object ist animierbar; Sprite ist der normale Anwendungsfall.

```ts
this.anims.create({
  key: "hero:run",
  frames: this.anims.generateFrameNumbers("hero", { start: 0, end: 5 }),
  frameRate: 12,
  repeat: -1,
});

player.play("hero:run", true);
```

Richtlinien:

- Globale Animationen einmal erstellen und dann in allen Szenen wiederverwenden.
- Lokale Animationen nur nutzen, wenn sie wirklich nur an ein einzelnes Objekt gebunden sein sollen.
- `generateFrameNumbers()` für Spritesheets, `generateFrameNames()` für Atlases.
- Bei Atlas-Problemen Frame-Namen loggen: `this.textures.get(key).getFrameNames()`.
- `sprite.play(key, true)` verhindert unnötige Neustarts derselben Animation.
- Animation-Mixes sind gut für übergänge; Chaining nicht unkontrolliert in jedem Frame erweitern.

## Tweens, Time und Timelines

Tweens ändern Objekt-Properties über Zeit. Sie sind szenengebunden und können Game Objects, Sounds, Kameras oder einfache JS-Objekte betreffen.

```ts
this.tweens.add({
  targets: player,
  scale: { from: 1, to: 1.18 },
  yoyo: true,
  duration: 120,
  ease: "Cubic.easeOut",
});
```

Timer:

```ts
this.time.delayedCall(500, () => {
  this.events.emit("spawn:wave");
});

const loop = this.time.addEvent({
  delay: 1000,
  loop: true,
  callback: spawnEnemy,
  callbackScope: this,
});
```

Richtlinien:

- Verwende Timer statt Browser-`setTimeout`, damit Pause, Scene-Lifecycle und TimeScale korrekt greifen.
- Kein Timer mit `delay: 0` und `loop: true` oder `repeat > 0`.
- Nutze `timeScale` für Slow-Motion oder beschleunigte Effekte.
- Timelines eignen sich für geskriptete Seqünzen mit Setzen von Properties, Tweens, Sounds und Events.

## Kameras

Jede Szene hat mindestens eine Kamera. Kameras steürn Viewport, Scroll, Zoom, Rotation, Bounds und Follow-Verhalten.

```ts
const camera = this.cameras.main;
camera.setBounds(0, 0, mapWidth, mapHeight);
camera.startFollow(player, true, 0.12, 0.12);
camera.setDeadzone(120, 80);
```

Richtlinien:

- `scrollX`/`scrollY` sind unzoomed Scroll-Koordinaten.
- `centerOn(x, y)` und `pan(x, y)` beziehen sich auf den Mittelpunkt der Kamera.
- Bounds begrenzen Kamerascroll, nicht die Position von Game Objects.
- Mehrere Kameras eignen sich für Split-Screen, Minimap oder Picture-in-Picture.
- UI häufig in eigene Szene oder eigene Kamera legen, statt Scroll-Faktoren überall zu patchen.

Effekte:

```ts
this.cameras.main.shake(180, 0.006);
this.cameras.main.fadeOut(250, 0, 0, 0);
```

## Audio

Phasers Sound Manager ist global. Ein Sound aus Szene A spielt weiter, wenn Szene A gewechselt wird, solange du ihn nicht stoppst.

```ts
this.load.audio("hit", ["assets/audio/hit.mp3", "assets/audio/hit.ogg"]);

this.sound.play("hit", { volume: 0.45 });

const music = this.sound.add("music", { loop: true, volume: 0.6 });
music.play();
this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => music.stop());
```

Richtlinien:

- Browser blockieren Audio oft bis zur ersten Nutzerinteraktion. Prüfe `this.sound.locked`, wenn Sound scheinbar nicht startet.
- Lade mehrere Formate, wenn du Browserabdeckung brauchst; mindestens MP3 ist pragmatisch.
- Verwende Marker oder Audio Sprites für viele kurze Sound-Segmente.
- Stoppe oder fade looppende Sounds explizit beim Szenenende.
- Web Audio kann mehr als HTML5 Audio, z. B. positional/following Audio, aber nicht jeder Browser bietet dieselben Fähigkeiten.

## Display, FX und Farben

Display-Funktionen:

- Blend Modes sind mächtig, können aber WebGL-Batches flushen. Setze sie gezielt.
- Masken liegen im World Space; ein Game Object und seine Maske nicht unüberlegt gemeinsam in denselben Container stecken.
- Bitmap Masks sind WebGL-only, Geometry Masks funktionieren über Geometriepfade.
- `Phaser.Display.Color` hilft bei RGB/HSV-Konvertierung, Interpolation und generierten Paletten.

FX:

- Pre FX wirken auf texturbasierte Game Objects und verändern den Draw dieses Objekts.
- Post FX wirken auf Game Objects oder Kameras und können auch Container/Kameras als Gesamtbild beeinflussen.
- FX sind WebGL-only; baue Fallbacks oder prüfe Renderer-Annahmen.

```ts
const glow = player.postFX.addGlow(0xffd166, 2, 0, false, 0.1, 8);
glow.outerStrength = 4;
player.postFX.remove(glow);
```

## Device und Utils

Nutze Device-Abfragen für echte Feature-Entscheidungen, nicht für pauschale Browserweichen:

```ts
const supportsWebAudio = this.game.device.audio.webAudio;
const isDesktop = this.game.device.os.desktop;
const pixelRatio = this.game.device.os.pixelRatio;
```

Nutze `Phaser.Utils.Array` für Listenoperationen, wenn Phaser-Objektlisten manipuliert werden:

```ts
Phaser.Utils.Array.Shuffle(spawnPoints);
Phaser.Utils.Array.Remove(enemies, enemy);
```

Richtlinien:

- Device-Flags für Audio-/Videoformat-Support vor optionalen Features prüfen.
- Utils nur einsetzen, wenn sie Klarheit oder Phaser-Kompatibilität bringen; normales TypeScript bleibt für einfache Logik in Ordnung.

## Prüfliste

- Wird jede Animation nur einmal pro Key erstellt?
- Werden Tweens und Timer an die richtige Szene gebunden?
- Stoppen looppende Sounds bei Szenenwechsel?
- Hat die Kamera sinnvolle Bounds, Follow-Lerp und Deadzone?
- Sind FX auf WebGL beschränkt oder mit Fallback versehen?
- Werden Blend Modes und Masken wegen Performance und World-Space-Verhalten bewusst eingesetzt?
- Gibt es Feedback für Input, Treffer, Schaden, Sammeln, Pause und Szenenübergänge?

## Quellen

- https://docs.phaser.io/phaser/concepts/animations
- https://docs.phaser.io/phaser/concepts/tweens
- https://docs.phaser.io/phaser/concepts/time
- https://docs.phaser.io/phaser/concepts/cameras
- https://docs.phaser.io/phaser/concepts/audio
- https://docs.phaser.io/phaser/concepts/display
- https://docs.phaser.io/phaser/concepts/fx
- https://docs.phaser.io/phaser/concepts/device
- https://docs.phaser.io/phaser/concepts/utils
