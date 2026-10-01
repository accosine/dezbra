import { describe, expect, it } from "vitest";
import { isFusionWeapon, WEAPON_IDS, WEAPONS } from "./weapons";

const FUSION_COUNT = 6;
const BASE_WEAPON_COUNT = 8;
const MAX_WEAPON_LEVEL = 5;

describe("weapon catalog", (): void => {
  it("lists every weapon exactly once", (): void => {
    expect(WEAPON_IDS).toHaveLength(Object.keys(WEAPONS).length);
    expect(new Set(WEAPON_IDS)).toEqual(new Set(Object.keys(WEAPONS)));
  });

  it("builds every fusion from two different base weapons", (): void => {
    const fusions = Object.values(WEAPONS).filter((weapon) =>
      isFusionWeapon(weapon),
    );

    expect(fusions).toHaveLength(FUSION_COUNT);

    for (const ingredient of fusions.flatMap((fusion) => fusion.recipe ?? [])) {
      expect(isFusionWeapon(WEAPONS[ingredient])).toBe(false);
    }
  });

  it("keeps base weapons upgradeable to level five", (): void => {
    const baseWeapons = Object.values(WEAPONS).filter(
      (weapon) => !isFusionWeapon(weapon),
    );

    expect(baseWeapons).toHaveLength(BASE_WEAPON_COUNT);
    expect(new Set(baseWeapons.map((weapon) => weapon.maxLevel))).toEqual(
      new Set([MAX_WEAPON_LEVEL]),
    );
  });

  it("is frozen at runtime", (): void => {
    expect(Object.isFrozen(WEAPONS.pistol)).toBe(true);
  });
});
