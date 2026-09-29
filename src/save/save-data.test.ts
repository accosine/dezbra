import { DEFAULT_SAVE_DATA, parseSaveData } from "./save-data";
import { describe, expect, it } from "vitest";

const VALID_SAVE = {
  bestScore: 5200,
  bossKills: 3,
  coins: 410,
  fusionsBuilt: 1,
  purchasedItems: ["startArmor", "phoenix"],
  runsPlayed: 7,
  totalKills: 1234,
  unlockedCharacters: ["soldier", "anna"],
  unlockedMaps: ["city", "industrial"],
};

const FRACTIONAL_KILLS = { floored: 12, stored: 12.7 };

describe("parseSaveData", (): void => {
  it("accepts a valid save", (): void => {
    expect(parseSaveData(VALID_SAVE)).toEqual(VALID_SAVE);
  });

  it.each([null, "broken", [], undefined])(
    "falls back to the defaults for %s",
    (candidate): void => {
      expect(parseSaveData(candidate)).toEqual(DEFAULT_SAVE_DATA);
    },
  );

  it("replaces invalid counters with defaults and floors fractions", (): void => {
    const parsed = parseSaveData({
      ...VALID_SAVE,
      bestScore: -5,
      bossKills: "3",
      coins: Infinity,
      totalKills: FRACTIONAL_KILLS.stored,
    });

    expect(parsed.bestScore).toBe(DEFAULT_SAVE_DATA.bestScore);
    expect(parsed.bossKills).toBe(DEFAULT_SAVE_DATA.bossKills);
    expect(parsed.coins).toBe(DEFAULT_SAVE_DATA.coins);
    expect(parsed.totalKills).toBe(FRACTIONAL_KILLS.floored);
  });

  it("drops unknown identifiers and keeps the starter content", (): void => {
    const parsed = parseSaveData({
      purchasedItems: ["laserSword", "xpBoost"],
      unlockedCharacters: ["ghost", "dragon"],
      unlockedMaps: "cemetery",
    });

    expect(parsed.purchasedItems).toEqual(["xpBoost"]);
    expect(parsed.unlockedCharacters).toEqual(["soldier", "ghost"]);
    expect(parsed.unlockedMaps).toEqual(["city"]);
  });
});
