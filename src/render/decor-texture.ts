import type * as Phaser from "phaser";
import { DECOR_SHAPES, type DecorType } from "../data/decor-shapes";
import {
  type DecorDefinition,
  type DecorShape,
  VARIANT_COLOR,
} from "../data/decor-shape";
import { drawShapes } from "./shape-drawing";
import { getDecorTextureKey } from "./texture-keys";
import type { Rect } from "../utils/collision";
import type { Vector } from "../utils/vector";

const OPAQUE = 1;
const SINGLE_VARIANT = 1;

const measureShape = (shape: DecorShape): Rect => {
  if (shape.kind === "rect") {
    return { height: shape.height, width: shape.width, x: shape.x, y: shape.y };
  }

  const radius =
    shape.kind === "circle"
      ? shape.radius
      : Math.max(shape.radiusX, shape.radiusY);

  return {
    height: radius + radius,
    width: radius + radius,
    x: shape.x - radius,
    y: shape.y - radius,
  };
};

/** Returns the box around all shapes, relative to the decoration's center. */
export const measureDecorBounds = (definition: DecorDefinition): Rect => {
  const boxes = definition.shapes.map((shape) => measureShape(shape));
  const left = Math.min(...boxes.map((box) => box.x));
  const top = Math.min(...boxes.map((box) => box.y));
  const right = Math.max(...boxes.map((box) => box.x + box.width));
  const bottom = Math.max(...boxes.map((box) => box.y + box.height));

  return {
    height: Math.ceil(bottom - top),
    width: Math.ceil(right - left),
    x: left,
    y: top,
  };
};

/** Returns the origin (0–1) that puts the decoration's center at its position. */
export const getDecorOrigin = (type: DecorType): Vector => {
  const bounds = measureDecorBounds(DECOR_SHAPES[type]);

  return { x: -bounds.x / bounds.width, y: -bounds.y / bounds.height };
};

/** Draws a decoration with its center at the graphics' origin. */
export const drawDecor = (
  graphics: Phaser.GameObjects.Graphics,
  definition: DecorDefinition,
  variantColor: string,
): void => {
  drawShapes(graphics, definition.shapes, { alpha: OPAQUE, variantColor });
};

/** Number of color variants a decoration has (at least one). */
export const countDecorVariants = (type: DecorType): number =>
  Math.max(SINGLE_VARIANT, DECOR_SHAPES[type].variantColors.length);

const createDecorTexture = (
  scene: Phaser.Scene,
  type: DecorType,
  variant: number,
): void => {
  const definition = DECOR_SHAPES[type];
  const bounds = measureDecorBounds(definition);
  const graphics = scene.make.graphics({}, false);

  graphics.translateCanvas(-bounds.x, -bounds.y);

  drawDecor(
    graphics,
    definition,
    definition.variantColors[variant] ?? VARIANT_COLOR,
  );
  graphics.generateTexture(
    getDecorTextureKey(type, variant),
    bounds.width,
    bounds.height,
  );
  graphics.destroy();
};

/** Bakes every decoration in every color variant into textures. */
export const createDecorTextures = (scene: Phaser.Scene): void => {
  const types = Object.keys(DECOR_SHAPES).filter((type): type is DecorType =>
    Object.hasOwn(DECOR_SHAPES, type),
  );

  for (const type of types) {
    for (
      let variant = 0;
      variant < countDecorVariants(type);
      variant += SINGLE_VARIANT
    ) {
      createDecorTexture(scene, type, variant);
    }
  }
};
