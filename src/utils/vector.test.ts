import {
  createVectorFromAngle,
  getVectorLength,
  normalizeVector,
  ZERO_VECTOR,
} from "./vector";
import { describe, expect, it } from "vitest";

const SAMPLE = { angle: Math.PI, length: 3 };
const RIGHT_TRIANGLE = { x: 3, y: 4 };
const RIGHT_TRIANGLE_LENGTH = 5;
const UNIT_LENGTH = 1;

describe("vector", (): void => {
  it("creates a vector from an angle and length", (): void => {
    const vector = createVectorFromAngle(SAMPLE.angle, SAMPLE.length);

    expect(vector.x).toBeCloseTo(-SAMPLE.length);
    expect(vector.y).toBeCloseTo(ZERO_VECTOR.y);
  });

  it("measures the length of a vector", (): void => {
    expect(getVectorLength(RIGHT_TRIANGLE)).toBe(RIGHT_TRIANGLE_LENGTH);
  });

  it("normalizes a vector to unit length", (): void => {
    expect(getVectorLength(normalizeVector(RIGHT_TRIANGLE))).toBeCloseTo(
      UNIT_LENGTH,
    );
  });

  it("keeps the zero vector unchanged when normalizing", (): void => {
    expect(normalizeVector(ZERO_VECTOR)).toEqual(ZERO_VECTOR);
  });
});
