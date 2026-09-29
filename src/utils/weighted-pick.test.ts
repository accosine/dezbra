import { describe, expect, it } from "vitest";
import { pickWeighted } from "./weighted-pick";

const ENTRIES = [
  { element: "common", weight: 12 },
  { element: "rare", weight: 6 },
  { element: "legendary", weight: 2 },
];

const ROLLS = { overshoot: 2, zero: 0 };

const fixed =
  (value: number): (() => number) =>
  (): number =>
    value;

describe("pickWeighted", (): void => {
  it.each([
    { expected: "common", roll: 0 },
    { expected: "common", roll: 0.59 },
    { expected: "rare", roll: 0.61 },
    { expected: "legendary", roll: 0.95 },
  ])("picks $expected for roll $roll", ({ expected, roll }): void => {
    expect(pickWeighted(fixed(roll), ENTRIES)).toBe(expected);
  });

  it("returns nothing for an empty list", (): void => {
    expect(pickWeighted(fixed(ROLLS.zero), [])).toBeUndefined();
  });

  it("falls back to the last entry when the roll overshoots", (): void => {
    expect(pickWeighted(fixed(ROLLS.overshoot), ENTRIES)).toBe("legendary");
  });
});
