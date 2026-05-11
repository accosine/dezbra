# Game-Object-Komponenten - Referenz

## Häufige Komponenten

- Transform: `x`, `y`, `z`, `w`, `scaleX`, `scaleY`, `rotation`, `angle`.
- Origin: `originX`, `originY`, `setOrigin`, `setDisplayOrigin`.
- Alpha: `alpha`, `setAlpha`.
- Visible: `visible`, `setVisible`.
- Active: `active`, `setActive`.
- Depth: `depth`, `setDepth`.
- BlendMode: `blendMode`, `setBlendMode`.
- ScrollFactor: `scrollFactorX`, `scrollFactorY`, `setScrollFactor`.
- Tint: `setTint`, `clearTint`, `setTintFill`.
- Data: `setData`, `getData`, `incData`, `toggleData`.

## Hinweise

Nicht jedes Game Object besitzt jede Komponente. Vor generischen Helfern prüfen, ob die Zielobjekte die benötigte Methode oder Property besitzen.
