import {
  BLOATED_ZOMBIE_SPRITE,
  BRUTE_ZOMBIE_SPRITE,
  SHAMBLER_ZOMBIE_SPRITE,
  SPRINTER_ZOMBIE_SPRITE,
} from "./sprites/zombie-sprites";
import { describe, expect, it } from "vitest";
import { type PixelSprite, TRANSPARENT_PIXEL } from "./pixel-sprite";
import { ANNA_SPRITE } from "./sprites/anna-sprite";
import { BLITZ_SPRITE } from "./sprites/blitz-sprite";
import { GHOST_SPRITE } from "./sprites/ghost-sprite";
import { HANS_SPRITE } from "./sprites/hans-sprite";
import { SOLDIER_SPRITE } from "./sprites/soldier-sprite";
import { ZARA_SPRITE } from "./sprites/zara-sprite";

const CHARACTER_SIZE = { height: 16, width: 10 };
const ZOMBIE_SIZE = { height: 12, width: 7 };
const HEX_COLOR = /^#[\da-f]{6}$/u;

const characterSprites = [
  ANNA_SPRITE,
  BLITZ_SPRITE,
  GHOST_SPRITE,
  HANS_SPRITE,
  SOLDIER_SPRITE,
  ZARA_SPRITE,
];
const zombieSprites = [
  BLOATED_ZOMBIE_SPRITE,
  BRUTE_ZOMBIE_SPRITE,
  SHAMBLER_ZOMBIE_SPRITE,
  SPRINTER_ZOMBIE_SPRITE,
];

const expectConsistentSprite = (
  sprite: PixelSprite,
  size: Readonly<{ height: number; width: number }>,
): void => {
  const codes = new Set(sprite.palette.map(([code]) => code));

  expect(sprite.rows).toHaveLength(size.height);

  for (const row of sprite.rows) {
    expect(row).toHaveLength(size.width);

    for (const code of row.replaceAll(TRANSPARENT_PIXEL, "")) {
      expect(codes.has(code)).toBe(true);
    }
  }

  for (const [, color] of sprite.palette) {
    expect(color).toMatch(HEX_COLOR);
  }
};

describe("pixel sprites", (): void => {
  it.each(characterSprites)(
    "keeps character sprite %# consistent",
    (sprite) => {
      expectConsistentSprite(sprite, CHARACTER_SIZE);
    },
  );

  it.each(zombieSprites)("keeps zombie sprite %# consistent", (sprite) => {
    expectConsistentSprite(sprite, ZOMBIE_SIZE);
  });
});
