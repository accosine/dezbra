import { describe, expect, it } from "vitest";
import { toEnemyId } from "./entities";

const VALID_ID = 42;
const FRACTIONAL_ID = 1.5;

describe("toEnemyId", (): void => {
  it("accepts integer counters", (): void => {
    expect(toEnemyId(VALID_ID)).toBe(VALID_ID);
  });

  it("rejects non-integer values", (): void => {
    expect(() => toEnemyId(FRACTIONAL_ID)).toThrow(RangeError);
  });
});
