---
name: phaser-szenen-und-assets
description: Nutze diesen Skill, wenn ein Phaser-Spiel angelegt, strukturiert oder refaktoriert wird, insbesondere für Game-Konfiguration, Szenen-Lifecycle, Loader, Texturen, Scale Manager, Registry/Data Manager und Cross-Scene-Kommunikation.
---

# Phaser Szenen und Assets

Arbeite in Phaser von der Laufzeitstruktur her: `Phaser.Game` ist der einmalige Einstiegspunkt, Szenen sind die fachlichen Abschnitte, Assets werden vor Verwendung geladen und globale Daten gehören in die Registry.

## Vorgehen

1. Prüfe zuerst das vorhandene Setup (`package.json`, `src/`, Game-Config, vorhandene Szenen).
2. Wähle eine kleine Szenenstruktur statt einer Monolith-Datei, sobald mehr als ein Zustand existiert.
3. Lade geteilte Assets in einer Boot- oder Preload-Szene, szenenspezifische Assets in der nutzenden Szene.
4. Verwende stabile, eindeutige Asset-Keys. Keys sind case-sensitive und werden später für Texturen, Audio, JSON und Animationen genutzt.
5. Halte Persistenz getrennt: `this.data` für Szenenstatus, `gameObject.data` für Objektstatus, `this.registry` für globale spielweite Daten.
6. Räume Listener, Timer, Tweens und laufende Sounds beim `shutdown` oder `destroy` einer Szene auf, wenn sie nicht automatisch an die Szene gebunden sind.

## Game-Konfiguration

Bevorzuge eine zentrale Game-Config in `src/main.ts` oder `src/game.ts`.

```ts
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  width: 960,
  height: 540,
  backgroundColor: "#101820",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, PreloadScene, PlayScene, UIScene],
};

new Phaser.Game(config);
```

Richtlinien:

- `Phaser.AUTO` ist der pragmatische Default, solange kein Canvas- oder WebGL-Zwang besteht.
- Verwende `preBoot` nur für Konfiguration, die vor dem Systemstart gesetzt werden muss.
- Verwende `postBoot` für Arbeit, die erst nach Canvas- und Systemerzeugung laufen darf.
- Erzeuge normalerweise nur eine `Phaser.Game`-Instanz pro Seite.

## Szenenstruktur

Standardaufteilung:

- `BootScene`: minimale Konfiguration, kleine Payloads, globale Registry-Defaults.
- `PreloadScene`: geteilte Assets laden und Ladefortschritt anzeigen.
- `PlayScene`: Gameplay, Physik, Input, Levelzustand.
- `UIScene`: HUD, Menüs, Overlays; kann parallel über `PlayScene` laufen.

Callbacks:

- `init(data)`: eingehende Daten und leichte Initialisierung.
- `preload()`: Loader-Queue füllen, keine geladenen Assets voraussetzen.
- `create(data)`: Game Objects mit geladenen Assets erzeugen.
- `update(time, delta)`: Frame-Logik; `delta` für zeitbasierte Bewegung nutzen.

Szenen können parallel laufen, pausiert, geschlafen oder gewechselt werden. Gib jeder Szene einen eindeutigen Key und verwende `this.scene.start`, `launch`, `pause`, `resume`, `sleep` und `wake` bewusst.

## Loader und Texturen

Phaser lädt Assets über `this.load` in eine Queue. In `preload()` startet der Loader automatisch; ausserhalb davon muss `this.load.start()` explizit aufgerufen werden.

```ts
preload() {
  this.load.setPath("assets");
  this.load.image("sky", "sky.png");
  this.load.spritesheet("hero", "hero.png", {
    frameWidth: 32,
    frameHeight: 32,
  });
  this.load.atlas("enemies", "enemies.png", "enemies.json");
  this.load.json("level-1", "levels/level-1.json");
}
```

Richtlinien:

- Doppelte Keys werden pro Asset-Typ nicht erneut in die Queue aufgenommen. Vermeide Key-Reuse.
- Texturen sind nach dem Laden global über `this.textures` verfügbar, andere Daten über passende Caches wie `this.cache.json`.
- `load.image()` erzeugt eine Texture mit Basisframe, `load.spritesheet()` nummerierte Frames, Atlases benannte Frames.
- Bei dynamisch erzeugten Canvas-Texturen nach direkter Canvas-Manipulation `texture.refresh()` aufrufen, damit WebGL aktualisiert wird.
- Entferne Assets nur, wenn keine Game Objects oder Sound-Instanzen sie mehr verwenden.

## Scale Manager

Wähle den Scale-Modus passend zur Spielart:

- `Phaser.Scale.FIT`: feste Designauflösung mit Aspect-Ratio-Erhalt. Gute Wahl für die meisten 2D-Spiele.
- `Phaser.Scale.RESIZE`: Canvas folgt dem Parent frei; nutze es nur, wenn Layout und Kamera aktiv auf wechselnde Grössen reagieren.
- `Phaser.Scale.EXPAND`: kombiniert grössere sichtbare Fläche mit Skalierung, nützlich für responsive Weltansicht.
- `Phaser.Scale.NONE`: keine automatische Skalierung; dann `scene.scale.resize()` nur gezielt einsetzen.

Reagiere bei UI und Kameras auf Resize:

```ts
this.scale.on("resize", (gameSize) => {
  this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);
});
```

## Daten und Kommunikation

Verwende:

- `this.registry`: spielweite Werte wie Highscore, Optionen, freigeschaltete Level.
- `this.data`: Werte, die nur zur aktüllen Szene gehören.
- `sprite.setData(...)`: Werte, die direkt an ein Game Object gebunden sind.
- `this.events`: lokale Szenenereignisse.
- `this.game.events`: globale Ereignisse, nur mit eigenem Event-Namespace.

Beispiel für Cross-Scene-Kommunikation:

```ts
this.registry.set("score", 0);
this.registry.events.on("changedata-score", (_parent, Value) => {
  this.events.emit("hud:score-changed", Value);
});
```

Entferne nur eigene Listener und immer mit denselben Argumenten wie beim Registrieren. Kein pauschales `off()` auf Emittern, die Phaser oder andere Szenen mitbenutzen.

## Prüfliste

- Gibt es genau eine Game-Instanz?
- Sind Szene-Keys eindeutig?
- Werden Assets vor Verwendung geladen?
- Sind globale Daten in `registry`, lokale Daten in `data`?
- Wird UI getrennt von Gameplay gerendert, wenn sie unabhängig pausieren oder überlagern soll?
- Reagieren Kameras und HUD auf Scale-/Resize-änderungen?
- Werden manüll gesetzte globale Listener beim Szenenende entfernt?

## Quellen

- https://docs.phaser.io/phaser/concepts/game
- https://docs.phaser.io/phaser/concepts/scenes
- https://docs.phaser.io/phaser/concepts/loader
- https://docs.phaser.io/phaser/concepts/textures
- https://docs.phaser.io/phaser/concepts/scale-manager
- https://docs.phaser.io/phaser/concepts/data-manager
- https://docs.phaser.io/phaser/concepts/events
