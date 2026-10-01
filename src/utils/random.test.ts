import {
  createSeededRandom,
  pickRandom,
  randomBetween,
  randomCentered,
  randomChance,
  randomInteger,
  shuffle,
} from "./random";
import { describe, expect, it } from "vitest";

const SEED = 12_345;
const FIRST_VALUE_OF_SEED = 0.4132;
const UNIT_RANGE = { maximum: 1, minimum: 0 };
const SAMPLE_COUNT = 200;
const RANGE = { maximum: 7, minimum: 3 };
const FIXED_HALF = 0.5;
const FIXED_QUARTER = 0.25;
const DIE_SIDES = 6;
const CENTER_WIDTH = 10;
const CENTERED_QUARTER = -2.5;
const ELEMENTS = ["a", "b", "c", "d", "e"];

const fixed =
  (value: number): (() => number) =>
  (): number =>
    value;

const sampleMany = (random: () => number): ReadonlyArray<number> =>
  Array.from({ length: SAMPLE_COUNT }, (): number => random());

describe("createSeededRandom", (): void => {
  it("reproduces the generator of the original game", (): void => {
    expect(createSeededRandom(SEED)()).toBeCloseTo(FIRST_VALUE_OF_SEED);
  });

  it("returns the same sequence for the same seed", (): void => {
    expect(sampleMany(createSeededRandom(SEED))).toEqual(
      sampleMany(createSeededRandom(SEED)),
    );
  });

  it("stays within [0, 1)", (): void => {
    const values = sampleMany(createSeededRandom(SEED));

    expect(Math.min(...values)).toBeGreaterThanOrEqual(UNIT_RANGE.minimum);
    expect(Math.max(...values)).toBeLessThan(UNIT_RANGE.maximum);
  });
});

describe("random helpers", (): void => {
  it("maps into a range", (): void => {
    expect(randomBetween(fixed(FIXED_HALF), RANGE.minimum, RANGE.maximum)).toBe(
      (RANGE.minimum + RANGE.maximum) * FIXED_HALF,
    );
  });

  it("creates integers below the count", (): void => {
    expect(randomInteger(fixed(FIXED_HALF), DIE_SIDES)).toBe(
      DIE_SIDES * FIXED_HALF,
    );
  });

  it("centers values around zero", (): void => {
    expect(randomCentered(fixed(FIXED_QUARTER), CENTER_WIDTH)).toBe(
      CENTERED_QUARTER,
    );
  });

  it("decides chances against the probability", (): void => {
    expect(randomChance(fixed(FIXED_QUARTER), FIXED_HALF)).toBe(true);
    expect(randomChance(fixed(FIXED_HALF), FIXED_QUARTER)).toBe(false);
  });

  it("picks an element or nothing from an empty list", (): void => {
    expect(pickRandom(fixed(FIXED_HALF), ELEMENTS)).toBe("c");
    expect(pickRandom(fixed(FIXED_HALF), [])).toBeUndefined();
  });

  it("shuffles into a permutation without touching the input", (): void => {
    const shuffled = shuffle(createSeededRandom(SEED), ELEMENTS);

    expect(shuffled).toHaveLength(ELEMENTS.length);
    expect(shuffled).toEqual(expect.arrayContaining(ELEMENTS));
    expect(shuffled).not.toEqual(ELEMENTS);
    expect(ELEMENTS).toEqual(["a", "b", "c", "d", "e"]);
  });
});
