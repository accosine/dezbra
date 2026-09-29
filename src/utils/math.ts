import type { Vector } from "./vector";

const DOUBLE = 2;
const HALF_TURN_DEGREES = 180;

/** One full rotation in radians. */
export const FULL_TURN = Math.PI * DOUBLE;

/** Limits a value to the inclusive range [minimum, maximum]. */
export const clamp = (
  value: number,
  minimum: number,
  maximum: number,
): number => Math.max(minimum, Math.min(maximum, value));

/** Returns the distance between two points. */
export const distanceBetween = (from: Vector, to: Vector): number =>
  Math.hypot(to.x - from.x, to.y - from.y);

/** Returns the angle (radians) of the line from one point to another. */
export const angleBetween = (from: Vector, to: Vector): number =>
  Math.atan2(to.y - from.y, to.x - from.x);

/** Converts degrees to radians. */
export const degreesToRadians = (degrees: number): number =>
  (degrees * Math.PI) / HALF_TURN_DEGREES;
