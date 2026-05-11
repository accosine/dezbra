---
name: phaser-gameplay-systeme
description: "Nutze diesen Skill für Phaser-Gameplay-Code: Game Objects, Input, Keyboard, Dragging, Physics-Wahl, Geometry, Math, Actions, Objektzustand, Update-Logik und Kollisionen."
---

# Phaser Gameplay-Systeme

Gameplay-Code in Phaser sollte aus klaren Game Objects, szenengebundener Logik, bewusst gewählter Physik und explizitem Input bestehen. Vermeide versteckte DOM-Timer und globale Zustandsvariablen, wenn Phaser dafür eigene Systeme bereitstellt.

## Vorgehen

1. Bestimme, ob ein Objekt nur gerendert, interaktiv, animiert, physikalisch simuliert oder pro Frame aktualisiert werden muss.
2. Erzeuge Game Objects über `this.add` für sichtbare Objekte oder `this.make`/direkte Klassen nur, wenn du Display- oder Update-Listen gezielt kontrollieren willst.
3. Aktiviere Input und Physik explizit nur für Objekte, die sie brauchen.
4. Nutze `update(time, delta)` oder `preUpdate(time, delta)` für Frame-Logik statt `setTimeout`/`setInterval`.
5. Verwende Phaser-Math, Geometry und Actions für wiederkehrende Muster wie Abstand, Winkel, Spawn-Formen, Grid-Layout und Massenoperationen.

## Game Objects

Game Objects gehören genau zu einer Szene. Nach `destroy()` sind sie nicht wiederverwendbar; ein zerstörtes Objekt hat typischerweise keine gültige `scene` mehr.

Erzeugen:

```ts
const player = this.add.sprite(400, 300, "hero", 0);
const marker = this.make.image({ x: 20, y: 20, key: "ui-dot", add: false });
```

Zustand:

- `visible`: rendert oder rendert nicht, Logik kann weiterlaufen.
- `active`: steuert Verarbeitung in Update-Listen, wenn das Objekt dort ist.
- `state` oder `setState(...)`: leichter Objektzustand, z. B. `"idle"`, `"attack"`.
- `setData(...)`: objektbezogene strukturierte Daten.

Temporär deaktivieren:

```ts
enemy.setActive(false).setVisible(false);
```

Dauerhaft entfernen:

```ts
enemy.destroy();
```

Custom Game Object mit eigener Frame-Logik:

```ts
class Bullet extends Phaser.GameObjects.Image {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "bullet");
    scene.add.existing(this);
    this.addToUpdateList();
  }

  preUpdate(_time: number, delta: number) {
    this.x += 0.4 * delta;
    if (this.x > 1000) this.setActive(false).setVisible(false);
  }
}
```

## Input

Phaser vereinheitlicht Maus und Touch über Pointer-Events. Game Objects reagieren erst nach `setInteractive()`.

Pointer:

```ts
button
  .setInteractive({ useHandCursor: true })
  .on("pointerdown", (pointer, localX, localY, event) => {
    event.stopPropagation();
    this.events.emit("ui:button-down", pointer, localX, localY);
  });
```

Dragging:

```ts
token
  .setInteractive({ draggable: true })
  .on("drag", (_pointer, dragX, dragY) => {
    token.setPosition(dragX, dragY);
  });
```

Keyboard:

```ts
const keys = this.input.keyboard!.addKeys({
  up: "W",
  down: "S",
  left: "A",
  right: "D",
}) as Record<string, Phaser.Input.Keyboard.Key>;

if (keys.left.isDown) player.x -= speed * delta;
```

Richtlinien:

- Verwende spezifische Events wie `pointerdown`, `pointerup`, `dragstart`, `drag`, `dragend`.
- Für Tastaturbewegung ist Polling in `update()` oft robuster als viele Event-Callbacks.
- Nutze eigene Cursor nur über CSS-kompatible Cursorstrings.
- Entferne eigene Input-Listener, wenn Game Objects länger leben als die Szene oder wiederverwendet werden.

## Physics

Wähle genau ein Physiksystem für interagierende Objekte:

- Arcade Physics: schnell, einfach, Rechtecke/Kreise, ideal für Platformer, Top-down, Shooter, einfache Puzzle.
- Matter Physics: komplexere Körper, Constraints, Joints, Polygone und realistischere Simulation.

Arcade und Matter können in derselben Szene parallel laufen, interagieren aber nicht miteinander. Ein Sprite sollte nicht gleichzeitig in beide Systeme aufgenommen werden.

Arcade-Grundmuster:

```ts
this.physics.add.sprite(100, 100, "hero");
this.physics.add.collider(player, platforms);
this.physics.add.overlap(player, coin, collectCoin, undefined, this);
```

Richtlinien:

- Physik in der Game-Config oder pro Szene aktivieren.
- Nur physikrelevante Game Objects aktivieren.
- Bei Arcade einfache Shapes bevorzugen und Kollisionsboxen bewusst setzen.
- Bei Matter nur dann einsetzen, wenn Arcade die Mechanik nicht sauber abbildet.

## Geometry, Math und Actions

Nutze `Phaser.Geom` für Formen und Treffertests:

```ts
const spawnCircle = new Phaser.Geom.Circle(480, 270, 180);
const point = spawnCircle.getRandomPoint();
const inside = spawnCircle.contains(pointer.worldX, pointer.worldY);
```

Nutze `Phaser.Math` für Bewegung und Richtung:

```ts
const angle = Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y);
const distance = Phaser.Math.Distance.Between(
  player.x,
  player.y,
  target.x,
  target.y,
);
const snappedX = Phaser.Math.Snap.To(pointer.worldX, 16);
```

Beachte:

- Rotation ist oft in Radians (`rotation`), `angle` ist in Degrees.
- `delta` ist Millisekunden; multipliziere Geschwindigkeiten entsprechend.
- Verwende QuadTree/Physics statt manüller Distanztests, wenn viele Objekte kollidieren müssen.

Actions sind statische Helfer für Arrays von Game Objects:

```ts
Phaser.Actions.GridAlign(enemies, {
  width: 6,
  cellWidth: 48,
  cellHeight: 48,
  x: 120,
  y: 80,
});

Phaser.Actions.PlaceOnCircle(enemies, new Phaser.Geom.Circle(480, 270, 160));
Phaser.Actions.SetAlpha(enemies, 0.8, 0.02);
```

Richtlinien:

- Actions prüfen oft nicht, ob jedes Objekt die passende Komponente besitzt. übergib saubere Arrays.
- Additive Actions wie `Rotate`, `ScaleXY` oder `Angle` können in `update()` laufen.
- Platzierungs-Actions wenden die Form nur zum Zeitpunkt des Aufrufs an. Bei animierter Form erneut aufrufen.

## Prüfliste

- Sind `active` und `visible` bewusst gesetzt?
- Wird `destroy()` nur für Objekte genutzt, die nicht wiederverwendet werden?
- Sind Pointer-/Keyboard-Listener eng genug an Szene oder Objekt gebunden?
- Ist die Physikentscheidung Arcade vs. Matter begründet?
- Werden Radians und Degrees nicht verwechselt?
- Nutzt Bewegungslogik `delta`?
- Werden Arrays vor `Phaser.Actions.*` gefiltert?

## Quellen

- https://docs.phaser.io/phaser/concepts/gameobjects
- https://docs.phaser.io/phaser/concepts/input
- https://docs.phaser.io/phaser/concepts/physics
- https://docs.phaser.io/phaser/concepts/geometry
- https://docs.phaser.io/phaser/concepts/math
- https://docs.phaser.io/phaser/concepts/actions
- https://docs.phaser.io/phaser/concepts/data-manager
