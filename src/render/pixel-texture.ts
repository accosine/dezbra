import type * as Phaser from "phaser";
import { hexToNumber } from "../utils/color";
import type { PixelSprite } from "../data/pixel-sprite";

/** Width and height of a pixel sprite in pixels. */
export const measurePixelSprite = (
  sprite: PixelSprite,
): Readonly<{ height: number; width: number }> => ({
  height: sprite.rows.length,
  width: Math.max(...sprite.rows.map((row) => row.length)),
});

/** Draws every opaque pixel of the sprite as a square of `scale` pixels. */
export const drawPixelSprite = (
  graphics: Phaser.GameObjects.Graphics,
  sprite: PixelSprite,
  scale: number,
): void => {
  const palette = new Map(sprite.palette);

  for (const [rowIndex, row] of sprite.rows.entries()) {
    for (const [columnIndex, code] of [...row].entries()) {
      const color = palette.get(code);

      if (color !== undefined) {
        graphics.fillStyle(hexToNumber(color));
        graphics.fillRect(columnIndex * scale, rowIndex * scale, scale, scale);
      }
    }
  }
};

/** Bakes a pixel sprite into a texture (no-op if the key already exists). */
export const createPixelTexture = (
  scene: Phaser.Scene,
  key: string,
  sprite: PixelSprite,
): void => {
  if (scene.textures.exists(key)) {
    return;
  }

  const graphics = scene.make.graphics({}, false);
  const size = measurePixelSprite(sprite);
  const scale = 1;

  drawPixelSprite(graphics, sprite, scale);
  graphics.generateTexture(key, size.width, size.height);
  graphics.destroy();
};
