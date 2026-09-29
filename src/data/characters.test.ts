import { describe, expect, it } from "vitest";
import { CHARACTERS } from "./characters";
import { WEAPONS } from "./weapons";

const CHARACTER_COUNT = 6;
const FIRST_INDEX = 0;
const UNLOCKED_FROM_START = 1;

describe("character catalog", (): void => {
  it("contains six uniquely identified characters", (): void => {
    const identifiers = new Set(CHARACTERS.map((character) => character.id));

    expect(identifiers.size).toBe(CHARACTER_COUNT);
  });

  it("starts with the soldier as the only unlocked character", (): void => {
    expect(CHARACTERS.at(FIRST_INDEX)?.id).toBe("soldier");
    expect(
      CHARACTERS.filter((character) => character.unlock === null),
    ).toHaveLength(UNLOCKED_FROM_START);
  });

  it("only starts with known weapons", (): void => {
    const startWeapons = CHARACTERS.flatMap(
      (character) => character.startWeapons,
    );

    for (const weaponId of startWeapons) {
      expect(WEAPONS[weaponId].id).toBe(weaponId);
    }
  });
});
