import {
  applyUnlocks,
  findNextUnlockHint,
  isCharacterUnlocked,
  isMapUnlocked,
} from "./unlocks";
import { DEFAULT_SAVE_DATA, type SaveData } from "./save-data";
import { describe, expect, it } from "vitest";

const VETERAN_SAVE = {
  ...DEFAULT_SAVE_DATA,
  bestScore: 6000,
  runsPlayed: 3,
};

describe("applyUnlocks", (): void => {
  it("unlocks everything whose requirement is met", (): void => {
    const { newlyUnlocked, save } = applyUnlocks(VETERAN_SAVE);

    expect(newlyUnlocked).toEqual([
      { kind: "character", name: "ANNA KRIEG" },
      { kind: "map", name: "INDUSTRIEGEBIET" },
    ]);
    expect(isCharacterUnlocked(save, "anna")).toBe(true);
    expect(isMapUnlocked(save, "industrial")).toBe(true);
  });

  it("does not unlock anything twice", (): void => {
    const { save } = applyUnlocks(VETERAN_SAVE);

    expect(applyUnlocks(save).newlyUnlocked).toEqual([]);
  });

  it("keeps locked content locked", (): void => {
    expect(isCharacterUnlocked(DEFAULT_SAVE_DATA, "ghost")).toBe(false);
    expect(isMapUnlocked(DEFAULT_SAVE_DATA, "wasteland")).toBe(false);
  });
});

describe("findNextUnlockHint", (): void => {
  it("names the first locked character", (): void => {
    expect(findNextUnlockHint(DEFAULT_SAVE_DATA)).toBe(
      "🔒 Erreiche 5.000 Punkte",
    );
  });

  it("falls back to the first locked map", (): void => {
    const allCharacters: SaveData = {
      ...DEFAULT_SAVE_DATA,
      unlockedCharacters: ["soldier", "anna", "blitz", "zara", "hans", "ghost"],
    };

    expect(findNextUnlockHint(allCharacters)).toBe("🔒 3 Runs spielen");
  });

  it("returns nothing once everything is unlocked", (): void => {
    const everything: SaveData = {
      ...DEFAULT_SAVE_DATA,
      unlockedCharacters: ["soldier", "anna", "blitz", "zara", "hans", "ghost"],
      unlockedMaps: ["city", "industrial", "cemetery", "wasteland"],
    };

    expect(findNextUnlockHint(everything)).toBeUndefined();
  });
});
