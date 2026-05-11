# Kameras - Referenz

## Wichtige Properties

| Property                   | Bedeutung                                       |
| -------------------------- | ----------------------------------------------- |
| `scrollX` / `scrollY`      | Weltposition, auf die die Kamera schaut.        |
| `zoomX` / `zoomY` / `zoom` | Zoom pro Achse oder gemeinsam.                  |
| `rotation`                 | Rotation in Radiant.                            |
| `originX` / `originY`      | Rotationsursprung im Viewport zwischen 0 und 1. |
| `x` / `y`                  | Position des Viewports auf dem Canvas.          |
| `width` / `height`         | Grösse des Viewports.                           |
| `worldView`                | Sichtbares Weltrechteck, nur lesbar.            |
| `midPoint`                 | Weltmittelpunkt der Kamera, nur lesbar.         |
| `alpha`                    | Deckkraft der gesamten Kameradarstellung.       |
| `visible`                  | Ob die Kamera rendert.                          |
| `roundPixels`              | Rundet Renderpositionen auf ganze Pixel.        |

## Wichtige Methoden

- Position und Größe: `setScroll`, `setZoom`, `setRotation`, `setAngle`, `setPosition`, `setSize`, `setViewport`, `setOrigin`.
- Bounds und Koordinaten: `setBounds`, `removeBounds`, `getBounds`, `centerOn`, `getScroll`, `getWorldPoint`.
- Sichtbarkeit und Filterung: `ignore`, `setBackgroundColor`, `setAlpha`, `setVisible`, `setName`, `setRoundPixels`.
- Follow: `startFollow`, `stopFollow`, `setLerp`, `setFollowOffset`, `setDeadzone`.
- Effekte: `fadeIn`, `fadeOut`, `fade`, `fadeFrom`, `flash`, `shake`, `pan`, `zoomTo`, `rotateTo`, `resetFX`.

## Typische Fallen

1. `this.cameras` ist der Manager; `this.cameras.main` ist die Hauptkamera.
2. `setViewport` verschiebt das Renderfenster, nicht die Welt.
3. `setScroll` verschiebt den Blick in der Welt.
4. `setZoom(0)` vermeiden.
5. Effekte starten nicht neu, solange sie laufen, ausser mit Force-Option.
6. `startFollow` springt beim ersten Aufruf direkt zum Ziel.
7. `roundPixels` plus nicht-ganzzahliger Zoom kann Jitter erzeugen.
8. Kamera-Rotation rotiert die Darstellung, nicht das Viewport-Rechteck.
9. Keyboard-Camera-Controls müssen in `update(delta)` manuell aktualisiert werden.
10. Für Minimap-Effekte können RenderTextures sauberer sein als komplexe Viewports.
