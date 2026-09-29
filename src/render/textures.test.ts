import {
  countDecorVariants,
  getDecorOrigin,
  measureDecorBounds,
} from "./decor-texture";
import {
  createPixelTexture,
  drawPixelSprite,
  measurePixelSprite,
} from "./pixel-texture";
import { describe, expect, it } from "vitest";
import {
  getCharacterTextureKey,
  getDecorTextureKey,
  getZombieTextureKey,
  TEXTURE_KEYS,
} from "./texture-keys";
import { samplePixel, useHarnessScene } from "../harness/phaser-harness";
import { CHARACTER_IDS } from "../data/characters";
import { createEllipsePoints } from "./ellipse-points";
import { createGameTextures } from "./game-textures";
import { DECOR_SHAPES } from "../data/decor-shapes";
import { hexToNumber } from "../utils/color";
import { SOLDIER_SPRITE } from "../data/sprites/soldier-sprite";

const getScene = useHarnessScene();
const SOLDIER_SIZE = { height: 16, width: 10 };
const HELMET_PIXEL = { x: 3, y: 0 };
const HELMET_COLOR = hexToNumber("#6c6c32");
const VIEW = { height: 830, width: 430 };
const ELLIPSE = { radiusX: 10, radiusY: 4, rotation: 0, x: 0, y: 0 };
const ELLIPSE_POINTS = 24;
const CAR_BODY = { x: -14, y: 0 };
const TRANSPARENT = 0;
const OPAQUE = 255;
const HALF = 0.5;
const QUARTER_TURN = Math.PI * HALF;
const SCALE = 1;
const FIRST = 0;
const SECOND = 1;
const LAST_ZOMBIE = 2;
const LAST_CAR = 5;
const HEX = { padding: 2, radix: 16 };

const toColorNumber = (
  color: Readonly<{ blue: number; green: number; red: number }>,
): number =>
  hexToNumber(
    `#${[color.red, color.green, color.blue].map((channel) => channel.toString(HEX.radix).padStart(HEX.padding, "0")).join("")}`,
  );

describe("pixel sprites", (): void => {
  it("measures and draws sprites pixel by pixel", (): void => {
    const graphics = getScene().add.graphics();

    drawPixelSprite(graphics, SOLDIER_SPRITE, SCALE);

    expect(measurePixelSprite(SOLDIER_SPRITE)).toEqual(SOLDIER_SIZE);
    expect(
      toColorNumber(samplePixel(graphics, SOLDIER_SIZE, HELMET_PIXEL)),
    ).toBe(HELMET_COLOR);
    expect(
      samplePixel(graphics, SOLDIER_SIZE, { x: FIRST, y: FIRST }).alpha,
    ).toBe(TRANSPARENT);
  });

  it("bakes a texture only once", (): void => {
    const scene = getScene();

    createPixelTexture(scene, "once", SOLDIER_SPRITE);
    createPixelTexture(scene, "once", SOLDIER_SPRITE);

    expect(scene.textures.get("once").source.at(FIRST)?.width).toBe(
      SOLDIER_SIZE.width,
    );
  });
});

describe("decoration geometry", (): void => {
  it("outlines rotated ellipses", (): void => {
    const points = createEllipsePoints(ELLIPSE);
    const rotated = createEllipsePoints({ ...ELLIPSE, rotation: QUARTER_TURN });

    expect(points).toHaveLength(ELLIPSE_POINTS);
    expect(points.at(FIRST)).toEqual({ x: ELLIPSE.radiusX, y: ELLIPSE.y });
    expect(rotated.at(FIRST)?.y).toBeCloseTo(ELLIPSE.radiusX);
  });

  it("measures bounds of rectangles, circles and ellipses", (): void => {
    expect(measureDecorBounds(DECOR_SHAPES.crate)).toEqual({
      height: 18,
      width: 18,
      x: -9,
      y: -9,
    });
    expect(measureDecorBounds(DECOR_SHAPES.lamp)).toMatchObject({
      x: -35,
      y: -61,
    });
    expect(measureDecorBounds(DECOR_SHAPES.rock)).toMatchObject({
      x: -14,
      y: -14,
    });
    expect(getDecorOrigin("crate")).toEqual({ x: HALF, y: HALF });
    expect(countDecorVariants("car")).toBe(
      DECOR_SHAPES.car.variantColors.length,
    );
    expect(countDecorVariants("lamp")).toBe(SCALE);
  });
});

describe("createGameTextures", (): void => {
  it("creates every texture of the game", (): void => {
    const scene = getScene();

    createGameTextures(scene, VIEW);
    createGameTextures(scene, VIEW);

    const keys = [
      ...CHARACTER_IDS.map((characterId) =>
        getCharacterTextureKey(characterId),
      ),
      getZombieTextureKey(FIRST),
      getZombieTextureKey(LAST_ZOMBIE),
      TEXTURE_KEYS.brute,
      TEXTURE_KEYS.stain,
      TEXTURE_KEYS.vignette,
      getDecorTextureKey("car", LAST_CAR),
      getDecorTextureKey("skull", FIRST),
    ];

    expect(keys.filter((key) => !scene.textures.exists(key))).toEqual([]);
  });

  it("paints decorations in their variant color and darkens the view edges", (): void => {
    const scene = getScene();
    const bounds = measureDecorBounds(DECOR_SHAPES.car);
    const carKey = getDecorTextureKey("car", SECOND);
    const body = scene.textures.getPixel(
      CAR_BODY.x - bounds.x,
      CAR_BODY.y - bounds.y,
      carKey,
    );
    const center = scene.textures.getPixel(
      VIEW.width * HALF,
      VIEW.height * HALF,
      TEXTURE_KEYS.vignette,
    );
    const corner = scene.textures.getPixel(FIRST, FIRST, TEXTURE_KEYS.vignette);

    expect(body === null ? null : toColorNumber(body)).toBe(
      hexToNumber(DECOR_SHAPES.car.variantColors[SECOND] ?? ""),
    );
    expect(center?.alpha).toBe(TRANSPARENT);
    expect(corner?.alpha).toBeGreaterThan(TRANSPARENT);
    expect(corner?.alpha).toBeLessThan(OPAQUE);
  });
});
