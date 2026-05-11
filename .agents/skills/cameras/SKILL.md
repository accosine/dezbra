---
name: cameras
description: "Nutze diesen Skill für Phaser-Kameras: CameraManager, Viewports, Scroll, Zoom, Follow, Bounds, Deadzones, Effekte, mehrere Kameras und UI-Trennung."
---

# Phaser Kameras

**Verwandte Skills:** ../scale-and-responsive/SKILL.md, ../render-textures/SKILL.md

> Jede Szene besitzt einen `CameraManager` unter `this.cameras` und mindestens `this.cameras.main`. Kameras bestimmen, welcher Ausschnitt der Welt gerendert wird.

## Schnellstart

```js
const camera = this.cameras.main;
camera.setBounds(0, 0, mapWidth, mapHeight);
camera.startFollow(player, true, 0.12, 0.12);
camera.setDeadzone(120, 80);

this.cameras.main.shake(180, 0.006);
this.cameras.main.fadeOut(250, 0, 0, 0);
```

## Viewport, Scroll und Weltkoordinaten

`setViewport` oder `setPosition` verschiebt das Rechteck der Kamera auf dem Canvas. `scrollX` und `scrollY` verschieben, worauf die Kamera in der Welt schaut. `getWorldPoint(screenX, screenY)` wandelt Bildschirm- in Weltkoordinaten um.

`worldView` beschreibt den sichtbaren Weltenbereich. `midPoint` ist der Weltmittelpunkt der Kamera.

## Follow und Bounds

`startFollow(target, roundPixels, lerpX, lerpY, offsetX, offsetY)` bindet die Kamera an ein Ziel. Lerp-Werte glätten die Bewegung. `setDeadzone(width, height)` erlaubt Bewegung innerhalb eines Bereichs, ohne sofort zu scrollen. `setBounds(x, y, width, height)` begrenzt den Scrollbereich, nicht die Game-Object-Positionen.

## Mehrere Kameras

Mehrere Kameras eignen sich für Split-Screen, Minimap, Picture-in-Picture und getrennte UI. Nutze `camera.ignore(gameObjectOrList)`, um Objekte aus bestimmten Kameras auszuschliessen. Für HUDs ist oft eine eigene UI-Szene sauberer als viele `scrollFactor: 0`-Sonderfälle.

## Effekte

Kameräffekte sind `fadeIn`, `fadeOut`, `fade`, `fadeFrom`, `flash`, `shake`, `pan`, `zoomTo`, `rotateTo` und `resetFX`. Laufende Effekte starten nicht automatisch neu; übergib `force: true`, wenn ein Effekt laufende Effekte ersetzen soll.

Während `pan()` läuft, pausiert Follow-Logik. Nach Abschluss wird Follow fortgesetzt.

## Checkliste

- `this.cameras` nicht mit einem Array verwechseln; die Liste ist `this.cameras.cameras`.
- Viewport- und Scroll-Koordinaten getrennt behandeln.
- Nicht `setZoom(0)` verwenden.
- Bei Pixelart `roundPixels` nur mit passendem Zoom einsetzen.
- Kameraeffekte bei Szenenwechseln nicht als Gameplay-Zustand missbrauchen.
- Details in `references/REFERENCE.md` nachlesen, wenn API-Signaturen gebraucht werden.

## Quellen

- https://docs.phaser.io/phaser/concepts/cameras
