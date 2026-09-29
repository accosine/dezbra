import { HALF, NONE } from "../utils/numbers";
import { clamp } from "../utils/math";
import type { Vector } from "../utils/vector";

/** Size of the visible area in world pixels. */
export type ViewSize = Readonly<{ height: number; width: number }>;

/** Returns the camera scroll that centers the target but never shows outside the world. */
export const computeCameraScroll = (
  target: Vector,
  worldSize: number,
  view: ViewSize,
): Vector => ({
  x: clamp(target.x - view.width * HALF, NONE, worldSize - view.width),
  y: clamp(target.y - view.height * HALF, NONE, worldSize - view.height),
});
