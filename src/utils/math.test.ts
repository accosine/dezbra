import {
  angleBetween,
  clamp,
  degreesToRadians,
  distanceBetween,
  FULL_TURN,
} from "./math";
import { describe, expect, it } from "vitest";

const RANGE = { maximum: 10, minimum: 0 };
const INSIDE = 4;
const ABOVE = 12;
const BELOW = -3;
const ORIGIN = { x: 0, y: 0 };
const TARGET = { x: 3, y: 4 };
const TARGET_DISTANCE = 5;
const RIGHT_ANGLE_DEGREES = 90;
const QUARTER = 4;

describe("clamp", (): void => {
  it.each([
    { expected: INSIDE, value: INSIDE },
    { expected: RANGE.maximum, value: ABOVE },
    { expected: RANGE.minimum, value: BELOW },
  ])("limits $value to $expected", ({ expected, value }): void => {
    expect(clamp(value, RANGE.minimum, RANGE.maximum)).toBe(expected);
  });
});

describe("geometry", (): void => {
  it("measures the distance between points", (): void => {
    expect(distanceBetween(ORIGIN, TARGET)).toBe(TARGET_DISTANCE);
  });

  it("measures the angle between points", (): void => {
    expect(angleBetween(ORIGIN, TARGET)).toBeCloseTo(
      Math.atan2(TARGET.y, TARGET.x),
    );
  });

  it("converts degrees to radians", (): void => {
    expect(degreesToRadians(RIGHT_ANGLE_DEGREES)).toBeCloseTo(
      FULL_TURN / QUARTER,
    );
  });
});
