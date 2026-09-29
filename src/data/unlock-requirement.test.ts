import { describe, expect, it } from "vitest";
import { isRequirementMet } from "./unlock-requirement";

const REQUIREMENT = {
  hint: "🔒 3 Bosse",
  statistic: "bossKills",
  threshold: 3,
};
const STATISTICS = {
  bestScore: 0,
  bossKills: 0,
  fusionsBuilt: 0,
  runsPlayed: 0,
  totalKills: 0,
};

describe("isRequirementMet", (): void => {
  it.each([
    { bossKills: 2, expected: false },
    { bossKills: 3, expected: true },
    { bossKills: 4, expected: true },
  ])(
    "is $expected for $bossKills boss kills",
    ({ bossKills, expected }): void => {
      expect(
        isRequirementMet(
          { ...REQUIREMENT, statistic: "bossKills" },
          { ...STATISTICS, bossKills },
        ),
      ).toBe(expected);
    },
  );
});
