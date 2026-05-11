# Loader - Referenz

## Häufige Loader-Methoden

- `load.image(key, url)`: Einzelbild.
- `load.spritesheet(key, url, { frameWidth, frameHeight })`: Spritesheet.
- `load.atlas(key, textureURL, atlasURL)`: Texture Atlas.
- `load.audio(key, urls)`: Audio.
- `load.json(key, url)`: JSON-Daten.
- `load.tilemapTiledJSON(key, url)`: Tiled-Map.
- `load.bitmapFont(key, textureURL, fontDataURL)`: Bitmap Font.

## Loader-Events

- `progress`: Ladefortschritt zwischen 0 und 1.
- `fileprogress`: Fortschritt einer Datei.
- `filecomplete`: Datei erfolgreich geladen.
- `loaderror`: Datei fehlgeschlagen.
- `complete`: Loader fertig.
