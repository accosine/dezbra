# Sprites und Images - Referenz

## Image vs Sprite

- `Image`: statisches Bild, kein AnimationState.
- `Sprite`: Bild mit AnimationState, für Frame-Animationen.

## Wichtige Methoden

- `setTexture(key, frame?)`
- `setFrame(frame)`
- `setOrigin(x, y?)`
- `setScale(x, y?)`
- `setRotation(radians)`
- `setAngle(degrees)`
- `setFlipX(value)`, `setFlipY(value)`
- `setTint(color)`, `clearTint()`
- `setCrop(...)`

## Hinweise

Animationen benötigen Sprite oder ein Objekt mit passender Animation-Komponente. Für viele ähnliche Objekte Pools verwenden.
