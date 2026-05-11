# Input - Referenz

## Pointer-Events

- `pointerdown`: Pointer wurde gedrückt.
- `pointerup`: Pointer wurde losgelassen.
- `pointermove`: Pointer bewegt sich.
- `pointerover` / `pointerout`: Eintritt und Austritt über interaktivem Objekt.
- `dragstart`, `drag`, `dragend`: Drag-and-Drop-Lifecycle.

## Tastatur

- `this.input.keyboard.addKey("SPACE")` für einzelne Taste.
- `this.input.keyboard.addKeys({ left: "A", right: "D" })` für Maps.
- In `update` mit `isDown` pollen, wenn kontinuierliche Bewegung gebraucht wird.
- Events für einzelne Aktionen wie Pause, Inventar oder Bestätigen verwenden.

## Hit Areas

`setInteractive()` nutzt Standard-Hit-Areas, wenn möglich. Für eigene Formen `hitArea` und Callback übergeben. Bei transparenten Sprites ggf. Rechteck, Kreis oder Polygon explizit setzen.
