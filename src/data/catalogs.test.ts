import { BOSSES, findBossForWave } from "./bosses";
import { describe, expect, it } from "vitest";
import { LOOT } from "./loot";
import { PERKS } from "./perks";
import { SHOP_ITEMS } from "./shop-items";

const PERK_COUNT = 16;
const LOOT_COUNT = 15;
const SHOP_ITEM_COUNT = 6;
const FIRST_BOSS_WAVE = 3;
const WAVE_WITHOUT_BOSS = 4;

const countUnique = (identifiers: ReadonlyArray<string>): number => {
  const unique = new Set(identifiers);

  return unique.size;
};

describe("upgrade catalogs", (): void => {
  it("has uniquely identified perks, loot and shop items", (): void => {
    expect(countUnique(PERKS.map((perk) => perk.id))).toBe(PERK_COUNT);
    expect(countUnique(LOOT.map((loot) => loot.id))).toBe(LOOT_COUNT);
    expect(countUnique(SHOP_ITEMS.map((item) => item.id))).toBe(
      SHOP_ITEM_COUNT,
    );
  });

  it("never offers fusion rarity as a perk", (): void => {
    expect(PERKS.map((perk) => perk.rarity)).not.toContain("fusion");
  });
});

describe("boss catalog", (): void => {
  it("schedules bosses in increasing waves", (): void => {
    const waves = BOSSES.map((boss) => boss.wave);

    expect(waves).toEqual(waves.toSorted((left, right) => left - right));
  });

  it("finds the boss of a wave", (): void => {
    expect(findBossForWave(FIRST_BOSS_WAVE)?.name).toBe("FLEISCHBERG");
    expect(findBossForWave(WAVE_WITHOUT_BOSS)).toBeUndefined();
  });
});
