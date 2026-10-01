import { applyLoot, createLootOffers } from "./loot";
import { createTestState, fixedRandom } from "./sim-fixtures";
import { describe, expect, it } from "vitest";
import { createSeededRandom } from "../utils/random";
import type { GameState } from "./game-state";
import type { LootId } from "../data/loot";
import { RUN_TUNING } from "./tuning";

const SEED = 7;
const NONE = 0;
const OFFER_COUNT = 3;
const SINGLE = 1;
const HURT_HEALTH = 40;
const KNOWLEDGE_LEVELS = 3;
const NEUTRAL_ROLL = 0.5;

const chestState = (pendingLevelUps = NONE): GameState => {
  const state = createTestState();

  return {
    ...state,
    phase: "chest",
    progress: { ...state.progress, pendingChests: SINGLE, pendingLevelUps },
    stats: { ...state.stats, health: HURT_HEALTH },
  };
};

const LOOT_EFFECTS: ReadonlyArray<
  Readonly<{ expected: Partial<GameState["stats"]>; lootId: LootId }>
> = [
  { expected: { health: 100 }, lootId: "megaMedkit" },
  { expected: { health: 70, maxHealth: 160 }, lootId: "armorPlating" },
  { expected: { damageMultiplier: 1.55 }, lootId: "bloodlust" },
  { expected: { cooldownMultiplier: 0.62 }, lootId: "timeCrystal" },
  { expected: { area: 1.65 }, lootId: "shockField" },
  { expected: { hasPierce: true }, lootId: "armorPiercing" },
  { expected: { hasRevive: true }, lootId: "phoenixFeather" },
  { expected: { regeneration: 6 }, lootId: "nanoHealing" },
  { expected: { extraProjectiles: 2 }, lootId: "doubleBarrel" },
  { expected: { magnetMultiplier: 5 }, lootId: "superMagnet" },
  { expected: { critChance: 0.25 }, lootId: "critPlus" },
  { expected: { vampirism: 0.05 }, lootId: "vampireFang" },
];
const STORM_SPEED = 3.51;

describe("createLootOffers", (): void => {
  it("draws three different rewards", (): void => {
    const offers = createLootOffers(createSeededRandom(SEED));

    const identifiers = new Set(offers.map((offer) => offer.id));

    expect(identifiers.size).toBe(OFFER_COUNT);
  });
});

describe("applyLoot effects", (): void => {
  it.each(LOOT_EFFECTS)("applies $lootId", ({ expected, lootId }): void => {
    expect(applyLoot(chestState(), lootId).state.stats).toMatchObject(expected);
  });

  it("speeds up the player and freezes enemies", (): void => {
    expect(applyLoot(chestState(), "stormBoots").state.stats.speed).toBeCloseTo(
      STORM_SPEED,
    );
    expect(applyLoot(chestState(), "timeStop").state.progress.freezeTicks).toBe(
      RUN_TUNING.freezeTicks,
    );
  });

  it("grants three levels at once", (): void => {
    const { events, state } = applyLoot(chestState(), "knowledgeShard");

    expect(events.filter((event) => event.kind === "level-up")).toHaveLength(
      KNOWLEDGE_LEVELS,
    );
    expect(state.phase).toBe("upgrade");
    expect(state.progress.level).toBe(KNOWLEDGE_LEVELS + SINGLE);
  });
});

describe("applyLoot phase", (): void => {
  it("returns to play after the last reward", (): void => {
    expect(applyLoot(chestState(), "megaMedkit").state.phase).toBe("playing");
    expect(applyLoot(chestState(SINGLE), "megaMedkit").state.phase).toBe(
      "upgrade",
    );
    expect(fixedRandom(NEUTRAL_ROLL)()).toBe(NEUTRAL_ROLL);
  });
});
