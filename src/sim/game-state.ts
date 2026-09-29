import type {
  Bullet,
  Chest,
  Enemy,
  FloatingText,
  Gem,
  Particle,
  Player,
  WeaponSlot,
} from "./entities";
import type { CharacterDefinition } from "../data/characters";
import type { MapDefinition } from "../data/maps";
import type { World } from "./world";

/** What the run is waiting for; only "playing" advances the simulation. */
export type GamePhase = "chest" | "dead" | "playing" | "upgrade";

/** Modifiers of the player that perks, loot and the character change. */
export type PlayerStats = Readonly<{
  area: number;
  cooldownMultiplier: number;
  critChance: number;
  damageMultiplier: number;
  extraProjectiles: number;
  hasExplosiveRounds: boolean;
  hasPierce: boolean;
  hasRevive: boolean;
  hasShield: boolean;
  hasTimeLock: boolean;
  health: number;
  isReviveUsed: boolean;
  luck: number;
  magnetMultiplier: number;
  maxHealth: number;
  regeneration: number;
  regenerationTicks: number;
  shieldCooldownTicks: number;
  speed: number;
  vampirism: number;
  xpMultiplier: number;
}>;

/** Counters and timers of the current run. */
export type RunProgress = Readonly<{
  bestCombo: number;
  combo: number;
  comboTicks: number;
  earnedCoins: number;
  frame: number;
  freezeTicks: number;
  kills: number;
  lastStreakShown: number;
  level: number;
  levelFlashTicks: number;
  nextEnemyId: number;
  pendingChests: number;
  pendingLevelUps: number;
  score: number;
  shakeMagnitude: number;
  spawnTicks: number;
  timeLockTicks: number;
  wave: number;
  waveTicks: number;
  xp: number;
  xpToNextLevel: number;
}>;

/** The complete, immutable state of a run. */
export type GameState = Readonly<{
  bullets: ReadonlyArray<Bullet>;
  character: CharacterDefinition;
  chests: ReadonlyArray<Chest>;
  enemies: ReadonlyArray<Enemy>;
  floats: ReadonlyArray<FloatingText>;
  gems: ReadonlyArray<Gem>;
  map: MapDefinition;
  particles: ReadonlyArray<Particle>;
  phase: GamePhase;
  player: Player;
  progress: RunProgress;
  stats: PlayerStats;
  weapons: ReadonlyArray<WeaponSlot>;
  world: World;
}>;
