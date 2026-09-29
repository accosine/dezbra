import {
  createBanner,
  type StepResult,
  withEvents,
  withoutEvents,
} from "./step-result";
import type { GameState, PlayerStats } from "./game-state";
import { NONE, STEP } from "../utils/numbers";
import { type WeaponId, WEAPONS } from "../data/weapons";
import type { PerkId } from "../data/perks";
import { RUN_TUNING } from "./tuning";
import type { UpgradeOffer } from "./upgrade-offers";
import { withResolvedPhase } from "./phase";

const FUSION_COLOR = "#00d4ff";
const PERK_TUNING = {
  areaMultiplier: 1.4,
  cooldownFloor: 0.2,
  cooldownMultiplier: 0.78,
  critBonus: 0.15,
  critCap: 0.55,
  damageMultiplier: 1.25,
  healthBonus: 20,
  healthHeal: 40,
  magnetMultiplier: 2,
  regeneration: 3,
  speedMultiplier: 1.22,
  vampirism: 0.03,
  xpMultiplier: 1.35,
};

type StatsEffect = (stats: PlayerStats) => Partial<PlayerStats>;

const PERK_EFFECTS: Readonly<Record<Exclude<PerkId, "timelock">, StatsEffect>> =
  {
    area: (stats) => ({ area: stats.area * PERK_TUNING.areaMultiplier }),
    cooldown: (stats) => ({
      cooldownMultiplier: Math.max(
        PERK_TUNING.cooldownFloor,
        stats.cooldownMultiplier * PERK_TUNING.cooldownMultiplier,
      ),
    }),
    crit: (stats) => ({
      critChance: Math.min(
        PERK_TUNING.critCap,
        stats.critChance + PERK_TUNING.critBonus,
      ),
    }),
    damage: (stats) => ({
      damageMultiplier: stats.damageMultiplier * PERK_TUNING.damageMultiplier,
    }),
    explosive: () => ({ hasExplosiveRounds: true }),
    health: (stats) => ({
      health: Math.min(
        stats.maxHealth + PERK_TUNING.healthBonus,
        stats.health + PERK_TUNING.healthHeal,
      ),
      maxHealth: stats.maxHealth + PERK_TUNING.healthBonus,
    }),
    magnet: (stats) => ({
      magnetMultiplier: stats.magnetMultiplier * PERK_TUNING.magnetMultiplier,
    }),
    multifire: (stats) => ({ extraProjectiles: stats.extraProjectiles + STEP }),
    pierce: () => ({ hasPierce: true }),
    regeneration: (stats) => ({
      regeneration: stats.regeneration + PERK_TUNING.regeneration,
    }),
    revive: () => ({ hasRevive: true }),
    shield: () => ({ hasShield: true }),
    speed: (stats) => ({ speed: stats.speed * PERK_TUNING.speedMultiplier }),
    vampire: (stats) => ({
      vampirism: stats.vampirism + PERK_TUNING.vampirism,
    }),
    xpBoost: (stats) => ({
      xpMultiplier: stats.xpMultiplier * PERK_TUNING.xpMultiplier,
    }),
  };

const applyPerk = (state: GameState, perkId: PerkId): GameState => {
  if (perkId === "timelock") {
    return {
      ...state,
      progress: {
        ...state.progress,
        timeLockTicks: RUN_TUNING.timeLockInterval,
      },
      stats: { ...state.stats, hasTimeLock: true },
    };
  }

  return {
    ...state,
    stats: { ...state.stats, ...PERK_EFFECTS[perkId](state.stats) },
  };
};

const addWeapon = (state: GameState, weaponId: WeaponId): GameState => ({
  ...state,
  weapons: [
    ...state.weapons,
    { cooldownTicks: NONE, id: weaponId, level: STEP },
  ],
});

const buildFusion = (state: GameState, weaponId: WeaponId): StepResult => {
  const recipe: ReadonlyArray<WeaponId> = WEAPONS[weaponId].recipe ?? [];
  const withoutIngredients = {
    ...state,
    weapons: state.weapons.filter((weapon) => !recipe.includes(weapon.id)),
  };

  return withEvents(addWeapon(withoutIngredients, weaponId), [
    { kind: "fusion-built" },
    createBanner(`⚗ FUSION! ${WEAPONS[weaponId].icon}`, FUSION_COLOR),
  ]);
};

const levelWeapon = (state: GameState, weaponId: WeaponId): GameState => ({
  ...state,
  weapons: state.weapons.map((weapon) =>
    weapon.id === weaponId ? { ...weapon, level: weapon.level + STEP } : weapon,
  ),
});

const applyOffer = (state: GameState, offer: UpgradeOffer): StepResult => {
  if (offer.kind === "fusion") {
    return buildFusion(state, offer.weaponId);
  }

  if (offer.kind === "newWeapon") {
    return withoutEvents(addWeapon(state, offer.weaponId));
  }

  if (offer.kind === "weaponLevel") {
    return withoutEvents(levelWeapon(state, offer.weaponId));
  }

  return withoutEvents(applyPerk(state, offer.perkId));
};

/** Applies the chosen level-up offer and continues with the next pending choice or play. */
export const applyUpgrade = (
  state: GameState,
  offer: UpgradeOffer,
): StepResult => {
  const applied = applyOffer(state, offer);
  const pendingLevelUps = Math.max(
    NONE,
    applied.state.progress.pendingLevelUps - STEP,
  );

  return withEvents(
    withResolvedPhase({
      ...applied.state,
      progress: { ...applied.state.progress, pendingLevelUps },
    }),
    applied.events,
  );
};
