import { describe, expect, it } from "vitest";
import { aimBullet } from "./weapon-aim";
import { fixedRandom } from "./sim-fixtures";
import { WEAPON_PATTERNS } from "./weapon-patterns";
import type { WeaponId } from "../data/weapons";

const BASE = 1;
const ROLL = 0.75;
const FRAME = 100;

type AimCase = Readonly<{
  count: number;
  expected: number;
  index: number;
  weapon: WeaponId;
}>;

const AIM_CASES: ReadonlyArray<AimCase> = [
  { count: 3, expected: 0.91, index: 0, weapon: "deathray" },
  { count: 3, expected: 1.09, index: 2, weapon: "deathray" },
  { count: 5, expected: 0.63, index: 0, weapon: "shotgun" },
  { count: 5, expected: 1.37, index: 4, weapon: "shotgun" },
  { count: 1, expected: 0.63, index: 0, weapon: "shotgun" },
  { count: 2, expected: 1, index: 0, weapon: "pistol" },
  { count: 2, expected: 1.075, index: 1, weapon: "pistol" },
  { count: 1, expected: 1.05, index: 0, weapon: "uzi" },
  { count: 1, expected: 1, index: 0, weapon: "napalm" },
  { count: 2, expected: 1.42, index: 1, weapon: "boomerang" },
  { count: 3, expected: 1, index: 0, weapon: "laser" },
  { count: 3, expected: 1, index: 1, weapon: "laser" },
  { count: 3, expected: 1.12, index: 2, weapon: "laser" },
  { count: 4, expected: 10.6416, index: 2, weapon: "tempest" },
  { count: 4, expected: 3.7708, index: 1, weapon: "magic" },
];

describe("aimBullet", (): void => {
  it.each(AIM_CASES)(
    "aims $weapon bullet $index of $count at $expected",
    ({ count, expected, index, weapon }): void => {
      expect(
        aimBullet({
          baseAngle: BASE,
          count,
          frame: FRAME,
          index,
          pattern: WEAPON_PATTERNS[weapon],
          random: fixedRandom(ROLL),
        }),
      ).toBeCloseTo(expected);
    },
  );
});
