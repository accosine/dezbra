import type * as Phaser from "phaser";
import { clamp } from "../utils/math";
import { hexToNumber } from "../utils/color";

/** Frame and colors of a horizontal progress bar. */
export type ProgressBarLayout = Readonly<{
  background: string;
  border: string;
  height: number;
  width: number;
  x: number;
  y: number;
}>;

const BORDER_WIDTH = 2;
const EMPTY = 0;
const FULL = 1;

/** Redraws a bordered bar filled to `ratio` (clamped to 0–1) in the given color. */
export const drawProgressBar = (
  graphics: Phaser.GameObjects.Graphics,
  layout: ProgressBarLayout,
  fill: Readonly<{ color: string; ratio: number }>,
): void => {
  graphics.clear();
  graphics.fillStyle(hexToNumber(layout.background));
  graphics.fillRect(layout.x, layout.y, layout.width, layout.height);
  graphics.fillStyle(hexToNumber(fill.color));
  graphics.fillRect(
    layout.x,
    layout.y,
    layout.width * clamp(fill.ratio, EMPTY, FULL),
    layout.height,
  );
  graphics.lineStyle(BORDER_WIDTH, hexToNumber(layout.border));
  graphics.strokeRect(layout.x, layout.y, layout.width, layout.height);
};
