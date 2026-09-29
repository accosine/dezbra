import type { CharacterDefinition, CharacterId } from "../data/characters";
import type { GameState, PlayerStats, RunProgress } from "./game-state";
import { PLAYER_TUNING, RUN_TUNING } from "./tuning";
import { type WeaponId, WEAPONS } from "../data/weapons";
import { DOUBLE } from "../utils/numbers";
import { generateWorld } from "./world-generation";
import type { MapDefinition } from "../data/maps";
import type { ShopItemId } from "../data/shop-items";
import type { WeaponSlot } from "./entities";

/** Everything needed to start a run. */
export type RunSetup = Readonly<{
  character: CharacterDefinition;
  map: MapDefinition;
  purchasedItems: ReadonlyArray<ShopItemId>;
}>;

type StatsModifier = (stats: PlayerStats) => PlayerStats;

const SHOP_BONUS = {
  cooldownMultiplier: 0.9,
  damageMultiplier: 1.1,
  maxHealth: 30,
  xpMultiplier: 1.2,
};

const SHOP_MODIFIERS: Readonly<Record<ShopItemId, StatsModifier>> = {
  endurance: (stats) => ({
    ...stats,
    damageMultiplier: stats.damageMultiplier * SHOP_BONUS.damageMultiplier,
  }),
  phoenix: (stats) => ({ ...stats, hasRevive: true }),
  rapidFire: (stats) => ({
    ...stats,
    cooldownMultiplier:
      stats.cooldownMultiplier * SHOP_BONUS.cooldownMultiplier,
  }),
  startArmor: (stats) => ({
    ...stats,
    health: stats.health + SHOP_BONUS.maxHealth,
    maxHealth: stats.maxHealth + SHOP_BONUS.maxHealth,
  }),
  startShield: (stats) => ({ ...stats, hasShield: true }),
  xpBoost: (stats) => ({
    ...stats,
    xpMultiplier: stats.xpMultiplier * SHOP_BONUS.xpMultiplier,
  }),
};

const CHARACTER_BONUSES: Readonly<
  Partial<Record<CharacterId, Partial<PlayerStats>>>
> = {
  ghost: { hasPierce: true },
  hans: { hasShield: true, regeneration: 3 },
  zara: { area: 1.3 },
};

const createBaseStats = (setup: RunSetup): PlayerStats => ({
  area: 1,
  cooldownMultiplier: setup.character.cooldownMultiplier,
  critChance: 0,
  damageMultiplier: setup.character.damageMultiplier,
  extraProjectiles: 0,
  hasExplosiveRounds: false,
  hasPierce: false,
  hasRevive: false,
  hasShield: false,
  hasTimeLock: false,
  health: setup.character.health,
  isReviveUsed: false,
  luck: 0,
  magnetMultiplier: 1,
  maxHealth: setup.character.health,
  regeneration: 0,
  regenerationTicks: 0,
  shieldCooldownTicks: 0,
  speed: setup.character.speed * setup.map.speedMultiplier,
  vampirism: 0,
  xpMultiplier: 1,
});

const createStats = (setup: RunSetup): PlayerStats => {
  const withShopItems = setup.purchasedItems.reduce(
    (stats, itemId) => SHOP_MODIFIERS[itemId](stats),
    createBaseStats(setup),
  );

  return { ...withShopItems, ...CHARACTER_BONUSES[setup.character.id] };
};

const createStartWeapons = (
  weaponIds: ReadonlyArray<WeaponId>,
): ReadonlyArray<WeaponSlot> =>
  [...new Set(weaponIds)].map((weaponId) => ({
    cooldownTicks: null,
    id: weaponId,
    level: Math.min(
      WEAPONS[weaponId].maxLevel,
      weaponIds.filter((candidate) => candidate === weaponId).length,
    ),
  }));

const INITIAL_PROGRESS: RunProgress = {
  bestCombo: 0,
  combo: 0,
  comboTicks: 0,
  earnedCoins: 0,
  frame: 0,
  freezeTicks: 0,
  kills: 0,
  lastStreakShown: 0,
  level: 1,
  levelFlashTicks: 0,
  nextEnemyId: 1,
  pendingChests: 0,
  pendingLevelUps: 0,
  score: 0,
  shakeMagnitude: 0,
  spawnTicks: 0,
  timeLockTicks: 0,
  wave: 1,
  waveTicks: 0,
  xp: 0,
  xpToNextLevel: RUN_TUNING.startXpToNextLevel,
};

/** Creates the state of a fresh run with the player in the middle of the map. */
export const createRun = (setup: RunSetup): GameState => ({
  bullets: [],
  character: setup.character,
  chests: [],
  enemies: [],
  floats: [],
  gems: [],
  map: setup.map,
  particles: [],
  phase: "playing",
  player: {
    facing: 1,
    invulnerableTicks: 0,
    radius: PLAYER_TUNING.radius,
    walkFrame: 0,
    walkTicks: 0,
    x: setup.map.worldSize / DOUBLE,
    y: setup.map.worldSize / DOUBLE,
  },
  progress: INITIAL_PROGRESS,
  stats: createStats(setup),
  weapons: createStartWeapons(setup.character.startWeapons),
  world: generateWorld(setup.map),
});
