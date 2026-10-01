import { describe, expect, it } from "vitest";
import { formatClock, formatScore } from "./format";

describe("formatClock", (): void => {
  it.each([
    { expected: "0:00", seconds: 0 },
    { expected: "0:05", seconds: 5 },
    { expected: "2:07", seconds: 127 },
    { expected: "61:40", seconds: 3700 },
  ])("formats $seconds seconds as $expected", ({ expected, seconds }): void => {
    expect(formatClock(seconds)).toBe(expected);
  });
});

describe("formatScore", (): void => {
  it.each([
    { expected: "0", score: 0 },
    { expected: "5.000", score: 5000 },
    { expected: "1.234.567", score: 1_234_567.8 },
  ])("formats $score as $expected", ({ expected, score }): void => {
    expect(formatScore(score)).toBe(expected);
  });
});
