import { describe, expect, it } from "vitest";
import type { CharacterId } from "../data/characters";
import { createTestState } from "./sim-fixtures";
import { MAPS } from "../data/maps";
import type { PlayerStats } from "./game-state";

const CENTER_DIVISOR = 2;
const SHOP_BONUS = { cooldown: 0.9, damage: 1.1, health: 30, xp: 1.2 };
const HANS_REGENERATION = 3;
const ZARA_AREA = 1.3;
const WASTELAND_SPEED = 1.3;
const SOLDIER = { health: 100, speed: 2.6 };

const PASSIVES: ReadonlyArray<
  Readonly<{ characterId: CharacterId; expected: Partial<PlayerStats> }>
> = [
  {
    characterId: "hans",
    expected: { hasShield: true, regeneration: HANS_REGENERATION },
  },
  { characterId: "zara", expected: { area: ZARA_AREA } },
  { characterId: "ghost", expected: { hasPierce: true } },
];

describe("createRun setup", (): void => {
  it("places the player in the center of the map", (): void => {
    const state = createTestState();

    expect(state.player.x).toBe(MAPS.city.worldSize / CENTER_DIVISOR);
    expect(state.player.y).toBe(MAPS.city.worldSize / CENTER_DIVISOR);
    expect(state.phase).toBe("playing");
  });

  it("equips the start weapons and levels up duplicates", (): void => {
    expect(createTestState({ characterId: "blitz" }).weapons).toEqual([
      { cooldownTicks: null, id: "uzi", level: 2 },
    ]);
    expect(
      createTestState({ characterId: "anna" }).weapons.map(
        (weapon) => weapon.id,
      ),
    ).toEqual(["sniper", "pistol"]);
  });

  it("scales the speed with the map", (): void => {
    expect(createTestState({ mapId: "wasteland" }).stats.speed).toBeCloseTo(
      SOLDIER.speed * WASTELAND_SPEED,
    );
  });
});

describe("createRun bonuses", (): void => {
  it("applies every purchased shop item", (): void => {
    const { stats } = createTestState({
      purchasedItems: [
        "startArmor",
        "startShield",
        "xpBoost",
        "endurance",
        "rapidFire",
        "phoenix",
      ],
    });

    expect(stats).toMatchObject({
      cooldownMultiplier: SHOP_BONUS.cooldown,
      damageMultiplier: SHOP_BONUS.damage,
      hasRevive: true,
      hasShield: true,
      health: SOLDIER.health + SHOP_BONUS.health,
      maxHealth: SOLDIER.health + SHOP_BONUS.health,
      xpMultiplier: SHOP_BONUS.xp,
    });
  });

  it.each(PASSIVES)(
    "grants the $characterId passive",
    ({ characterId, expected }): void => {
      expect(createTestState({ characterId }).stats).toMatchObject(expected);
    },
  );
});
