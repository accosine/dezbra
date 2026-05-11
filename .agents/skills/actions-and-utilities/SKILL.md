---
name: actions-and-utilities
description: "Nutze diesen Skill für Phaser-Utility-Funktionen, Actions, Ausrichtung, Raster-Layouts und Batch-Operationen auf Game Objects."
---

# Phaser Actions und Hilfsfunktionen

**Verwandte Skills:** ../groups-and-containers/SKILL.md, ../sprites-and-images/SKILL.md

> `Phaser.Actions` bietet Einmal-Operationen auf Arrays von Game Objects. `Phaser.Utils.Array`, `Phaser.Utils.Objects` und `Phaser.Utils.String` decken häufige Listen-, Objekt- und String-Aufgaben ab.

## Schnellstart

```js
const sprites = [];
for (let index = 0; index < 20; index += 1) {
  sprites.push(this.add.sprite(0, 0, "gem"));
}

Phaser.Actions.GridAlign(sprites, {
  cellHeight: 64,
  cellWidth: 64,
  height: 4,
  width: 5,
  x: 100,
  y: 100,
});

Phaser.Actions.Spread(sprites, "alpha", 0, 1);
Phaser.Actions.IncX(sprites, 10, 2);
Phaser.Actions.PlaceOnCircle(sprites, new Phaser.Geom.Circle(400, 300, 200));
```

## Kernkonzepte

Actions erwarten als erstes Argument immer ein Array oder array-ähnliche Liste von Objekten mit den benötigten Properties. Sie geben dieselbe Liste zurück, speichern keinen Zustand und wirken sofort. Für Groups verwende `group.getChildren()`.

`PropertyValueSet(items, key, value, step, index, direction)` setzt Werte mit optionaler Schrittweite. `PropertyValueInc(...)` addiert entsprechend. Das ist nützlich für Wellen, Staffeln und Muster.

Geometrische Actions wie `PlaceOnCircle`, `PlaceOnLine` oder `RandomRectangle` erwarten `Phaser.Geom.*`-Objekte, nicht sichtbare Shape-Game-Objects. Bei `Phaser.GameObjects.Circle` verwende dessen Geometrie oder erzeuge direkt `new Phaser.Geom.Circle(...)`.

## Wichtige Actions

- Setzen: `SetX`, `SetY`, `SetXY`, `SetAlpha`, `SetDepth`, `SetOrigin`, `SetRotation`, `SetScale`, `SetScrollFactor`, `SetTint`, `SetVisible`, `PropertyValueSet`.
- Inkrementieren: `IncX`, `IncY`, `IncXY`, `IncAlpha`, `Angle`, `Rotate`, `ScaleX`, `ScaleY`, `ScaleXY`, `PropertyValueInc`.
- Platzieren: `PlaceOnCircle`, `PlaceOnEllipse`, `PlaceOnLine`, `PlaceOnRectangle`, `PlaceOnTriangle`, `RandomCircle`, `RandomEllipse`, `RandomLine`, `RandomRectangle`, `RandomTriangle`.
- Layout: `GridAlign`, `AlignTo`, `FitToRegion`.
- Verteilung: `Spread`, `SmoothStep`, `SmootherStep`.
- Bewegung: `RotateAround`, `RotateAroundDistance`, `ShiftPosition`, `WrapInRectangle`.
- Iteration: `GetFirst`, `GetLast`, `Call`, `Shuffle`, `ToggleVisible`, `PlayAnimation`.

## Utility-Nutzung

`Phaser.Utils.Array` eignet sich für `Add`, `AddAt`, `Remove`, `Replace`, `Shuffle`, `BringToTop`, `SendToBack`, `MoveUp`, `MoveDown`, `GetRandom` und `NumberArray`. Nutze diese Helfer, wenn du Phaser-Listen oder Display-Listen kompatibel bearbeiten willst.

`Phaser.Utils.Objects` hilft bei `GetValue`, `GetAdvancedValue`, `Merge`, `Clone` und `Pick`. Verwende es für robuste Config-Verarbeitung.

`Phaser.Utils.String` ist sinnvoll für Padding, UUIDs, Template-Ersetzung und einfache Formatierungen.

## Checkliste

- übergib echte Arrays oder `group.getChildren()`.
- Prüfe, ob alle Objekte die benötigte Property besitzen.
- Nutze Actions für einmalige Batch-Operationen, nicht für versteckte Langzeitlogik.
- Unterscheide `angle` in Grad und `rotation` in Radiant.
- Bei vielen dynamischen Objekten erst filtern, dann Action ausführen.

## Quellen

- https://docs.phaser.io/phaser/concepts/actions
- https://docs.phaser.io/phaser/concepts/utils
