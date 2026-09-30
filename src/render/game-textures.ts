import type * as Phaser from "phaser";
import {
  BLOATED_ZOMBIE_SPRITE,
  BRUTE_ZOMBIE_SPRITE,
  SHAMBLER_ZOMBIE_SPRITE,
  SPRINTER_ZOMBIE_SPRITE,
} from "../data/sprites/zombie-sprites";
import { CHARACTER_IDS, type CharacterId } from "../data/characters";
import {
  createGradientTexture,
  HUD_SHADE,
  HUD_SHADE_HEIGHT,
  OVERLAY_GRADIENTS,
} from "./gradient-textures";
import {
  getCharacterTextureKey,
  getZombieTextureKey,
  TEXTURE_KEYS,
} from "./texture-keys";
import { ANNA_SPRITE } from "../data/sprites/anna-sprite";
import { BLITZ_SPRITE } from "../data/sprites/blitz-sprite";
import { createDecorTextures } from "./decor-texture";
import { createPixelTexture } from "./pixel-texture";
import { GHOST_SPRITE } from "../data/sprites/ghost-sprite";
import { HANS_SPRITE } from "../data/sprites/hans-sprite";
import { hexToNumber } from "../utils/color";
import type { PixelSprite } from "../data/pixel-sprite";
import { SOLDIER_SPRITE } from "../data/sprites/soldier-sprite";
import { ZARA_SPRITE } from "../data/sprites/zara-sprite";

/** Pixel art of every character. */
export const CHARACTER_SPRITES: Readonly<Record<CharacterId, PixelSprite>> = {
  anna: ANNA_SPRITE,
  blitz: BLITZ_SPRITE,
  ghost: GHOST_SPRITE,
  hans: HANS_SPRITE,
  soldier: SOLDIER_SPRITE,
  zara: ZARA_SPRITE,
};

const ZOMBIE_SPRITES: ReadonlyArray<PixelSprite> = [
  SHAMBLER_ZOMBIE_SPRITE,
  BLOATED_ZOMBIE_SPRITE,
  SPRINTER_ZOMBIE_SPRITE,
];
const STAIN_RADIUS = 16;
const WHITE = hexToNumber("#ffffff");
const VIGNETTE = {
  inner: 0.2,
  innerStop: 0,
  origin: 0,
  outer: 0.9,
  outerStop: 1,
  shade: "rgba(0,0,0,0.65)",
  transparent: "rgba(0,0,0,0)",
};
const HALF = 0.5;

type Size = Readonly<{ height: number; width: number }>;

const createStainTexture = (scene: Phaser.Scene): void => {
  if (scene.textures.exists(TEXTURE_KEYS.stain)) {
    return;
  }

  const graphics = scene.make.graphics({}, false);

  graphics.fillStyle(WHITE);
  graphics.fillCircle(STAIN_RADIUS, STAIN_RADIUS, STAIN_RADIUS);
  graphics.generateTexture(
    TEXTURE_KEYS.stain,
    STAIN_RADIUS + STAIN_RADIUS,
    STAIN_RADIUS + STAIN_RADIUS,
  );
  graphics.destroy();
};

const paintVignette = (context: CanvasRenderingContext2D, size: Size): void => {
  const centerX = size.width * HALF;
  const centerY = size.height * HALF;
  const gradient = context.createRadialGradient(
    centerX,
    centerY,
    size.height * VIGNETTE.inner,
    centerX,
    centerY,
    size.height * VIGNETTE.outer,
  );

  gradient.addColorStop(VIGNETTE.innerStop, VIGNETTE.transparent);
  gradient.addColorStop(VIGNETTE.outerStop, VIGNETTE.shade);
  context.fillStyle = gradient;
  context.fillRect(VIGNETTE.origin, VIGNETTE.origin, size.width, size.height);
};

const createVignetteTexture = (scene: Phaser.Scene, size: Size): void => {
  const texture = scene.textures.exists(TEXTURE_KEYS.vignette)
    ? null
    : scene.textures.createCanvas(
        TEXTURE_KEYS.vignette,
        size.width,
        size.height,
      );

  if (texture !== null) {
    paintVignette(texture.context, size);
    texture.refresh();
  }
};

const createScreenTextures = (scene: Phaser.Scene, viewSize: Size): void => {
  createVignetteTexture(scene, viewSize);

  for (const gradient of OVERLAY_GRADIENTS) {
    createGradientTexture(scene, gradient, viewSize);
  }

  createGradientTexture(scene, HUD_SHADE, {
    height: HUD_SHADE_HEIGHT,
    width: viewSize.width,
  });
};

/** Generates every texture of the game (characters, zombies, decorations, stains, vignette). */
export const createGameTextures = (
  scene: Phaser.Scene,
  viewSize: Size,
): void => {
  for (const characterId of CHARACTER_IDS) {
    createPixelTexture(
      scene,
      getCharacterTextureKey(characterId),
      CHARACTER_SPRITES[characterId],
    );
  }

  for (const [variant, sprite] of ZOMBIE_SPRITES.entries()) {
    createPixelTexture(scene, getZombieTextureKey(variant), sprite);
  }
  createPixelTexture(scene, TEXTURE_KEYS.brute, BRUTE_ZOMBIE_SPRITE);
  createDecorTextures(scene);
  createStainTexture(scene);
  createScreenTextures(scene, viewSize);
};
