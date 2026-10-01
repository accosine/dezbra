import type { GameState, PlayerStats } from "./game-state";
import { LOOT, type LootDefinition, type LootId } from "../data/loot";
import { NONE, STEP } from "../utils/numbers";
import { type Random, shuffle } from "../utils/random";
import { type StepResult, withEvents, withoutEvents } from "./step-result";
import { freezeEnemies } from "./run-timers";
import { gainExperience } from "./experience";
import { withResolvedPhase } from "./phase";

const LOOT_OFFER_COUNT = 3;
const KNOWLEDGE_LEVELS = 3;
const LOOT_TUNING = {
  areaMultiplier: 1.65,
  armorHeal: 30,
  armorHealth: 60,
  bloodlustMultiplier: 1.55,
  cooldownFloor: 0.18,
  cooldownMultiplier: 0.62,
  critBonus: 0.25,
  critCap: 0.6,
  extraProjectiles: 2,
  magnetMultiplier: 5,
  regeneration: 6,
  speedMultiplier: 1.35,
  vampirism: 0.05,
};

type LootEffect = (state: GameState) => StepResult;

const withStats =
  (effect: (stats: PlayerStats) => Partial<PlayerStats>): LootEffect =>
  (state) =>
    withoutEvents({
      ...state,
      stats: { ...state.stats, ...effect(state.stats) },
    });

const gainOneLevel = (result: StepResult): StepResult => {
  const next = gainExperience(
    result.state,
    result.state.progress.xpToNextLevel + STEP,
  );

  return withEvents(next.state, [...result.events, ...next.events]);
};

const LOOT_EFFECTS: Readonly<Record<LootId, LootEffect>> = {
  armorPiercing: withStats(() => ({ hasPierce: true })),
  armorPlating: withStats((stats) => ({
    health: Math.min(
      stats.maxHealth + LOOT_TUNING.armorHealth,
      stats.health + LOOT_TUNING.armorHeal,
    ),
    maxHealth: stats.maxHealth + LOOT_TUNING.armorHealth,
  })),
  bloodlust: withStats((stats) => ({
    damageMultiplier: stats.damageMultiplier * LOOT_TUNING.bloodlustMultiplier,
  })),
  critPlus: withStats((stats) => ({
    critChance: Math.min(
      LOOT_TUNING.critCap,
      stats.critChance + LOOT_TUNING.critBonus,
    ),
  })),
  doubleBarrel: withStats((stats) => ({
    extraProjectiles: stats.extraProjectiles + LOOT_TUNING.extraProjectiles,
  })),
  knowledgeShard: (state) =>
    Array.from({ length: KNOWLEDGE_LEVELS }).reduce<StepResult>(
      (result) => gainOneLevel(result),
      withoutEvents(state),
    ),
  megaMedkit: withStats((stats) => ({ health: stats.maxHealth })),
  nanoHealing: withStats((stats) => ({
    regeneration: stats.regeneration + LOOT_TUNING.regeneration,
  })),
  phoenixFeather: withStats(() => ({ hasRevive: true })),
  shockField: withStats((stats) => ({
    area: stats.area * LOOT_TUNING.areaMultiplier,
  })),
  stormBoots: withStats((stats) => ({
    speed: stats.speed * LOOT_TUNING.speedMultiplier,
  })),
  superMagnet: withStats((stats) => ({
    magnetMultiplier: stats.magnetMultiplier * LOOT_TUNING.magnetMultiplier,
  })),
  timeCrystal: withStats((stats) => ({
    cooldownMultiplier: Math.max(
      LOOT_TUNING.cooldownFloor,
      stats.cooldownMultiplier * LOOT_TUNING.cooldownMultiplier,
    ),
  })),
  timeStop: freezeEnemies,
  vampireFang: withStats((stats) => ({
    vampirism: stats.vampirism + LOOT_TUNING.vampirism,
  })),
};

/** Draws three different chest rewards. */
export const createLootOffers = (
  random: Random,
): ReadonlyArray<LootDefinition> =>
  shuffle(random, LOOT).slice(NONE, LOOT_OFFER_COUNT);

/** Applies the chosen chest reward and continues with pending choices or play. */
export const applyLoot = (state: GameState, lootId: LootId): StepResult => {
  const applied = LOOT_EFFECTS[lootId](state);
  const pendingChests = Math.max(
    NONE,
    applied.state.progress.pendingChests - STEP,
  );

  return withEvents(
    withResolvedPhase({
      ...applied.state,
      progress: { ...applied.state.progress, pendingChests },
    }),
    applied.events,
  );
};
