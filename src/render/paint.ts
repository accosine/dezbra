import type * as Phaser from "phaser";
import { hexToNumber } from "../utils/color";
import { NONE } from "../utils/numbers";

const OPAQUE = 1;

/** A color with optional transparency. */
export type Paint = Readonly<{ alpha?: number; color: string }>;

/** A screen-space rectangle to fill. */
export type Box = Readonly<{
  height: number;
  width: number;
  x: number;
  y: number;
}>;

/** Sets the fill style from a paint. */
export const setFill = (
  graphics: Phaser.GameObjects.Graphics,
  paint: Paint,
): void => {
  graphics.fillStyle(hexToNumber(paint.color), paint.alpha ?? OPAQUE);
};

/** Fills several rectangles with one paint. */
export const fillBoxes = (
  graphics: Phaser.GameObjects.Graphics,
  paint: Paint,
  boxes: ReadonlyArray<Box>,
): void => {
  setFill(graphics, paint);

  for (const box of boxes) {
    graphics.fillRect(box.x, box.y, box.width, box.height);
  }
};

/** Sets the line style from a paint and width. */
export const setStroke = (
  graphics: Phaser.GameObjects.Graphics,
  paint: Paint,
  width: number,
): void => {
  graphics.lineStyle(width, hexToNumber(paint.color), paint.alpha ?? OPAQUE);
};

/** Returns positions from `start` (inclusive) to `end` (exclusive) in steps. */
export const listSteps = (
  start: number,
  end: number,
  step: number,
): ReadonlyArray<number> =>
  Array.from(
    { length: Math.max(NONE, Math.ceil((end - start) / step)) },
    (_value, index) => start + index * step,
  );
