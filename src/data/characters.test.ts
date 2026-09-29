import { CHARACTER_IDS, CHARACTER_LIST, CHARACTERS } from "./characters";
import { describe, expect, it } from "vitest";
import { WEAPONS } from "./weapons";

const CHARACTER_COUNT = 6;
const FIRST_INDEX = 0;
const UNLOCKED_FROM_START = 1;

describe("character catalog", (): void => {
  it("contains six uniquely identified characters", (): void => {
    const identifiers = new Set(CHARACTER_IDS);

    expect(identifiers.size).toBe(CHARACTER_COUNT);
  });

  it("starts with the soldier as the only unlocked character", (): void => {
    expect(CHARACTER_LIST.at(FIRST_INDEX)?.id).toBe("soldier");
    expect(
      CHARACTER_LIST.filter((character) => character.unlock === null),
    ).toHaveLength(UNLOCKED_FROM_START);
  });

  it("keys every character by its id", (): void => {
    for (const characterId of CHARACTER_IDS) {
      expect(CHARACTERS[characterId].id).toBe(characterId);
    }
  });

  it("only starts with known weapons", (): void => {
    const startWeapons = CHARACTER_LIST.flatMap(
      (character) => character.startWeapons,
    );

    for (const weaponId of startWeapons) {
      expect(WEAPONS[weaponId].id).toBe(weaponId);
    }
  });
});
