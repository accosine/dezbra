import type { BossDefinition } from "../data/bosses";
import type { Brand } from "../utils/brand";
import type { Vector } from "../utils/vector";
import type { WeaponId } from "../data/weapons";

/** Unique identifier of an enemy within a run. */
export type EnemyId = Brand<number, "EnemyId">;

const isEnemyId = (candidate: number): candidate is EnemyId =>
  Number.isSafeInteger(candidate);

/** Tags a run-local counter value as an enemy identifier. */
export const toEnemyId = (value: number): EnemyId => {
  if (!isEnemyId(value)) {
    throw new RangeError(`Invalid enemy id: ${value}`);
  }

  return value;
};

/** Attack timers of a boss (ticks since the last attack). */
export type BossState = Readonly<{
  chargeTicks: number;
  definition: BossDefinition;
  gunTicks: number;
  poisonTicks: number;
  summonTicks: number;
}>;

/** A zombie or boss; `spawnTicks > 0` means it is still appearing and invulnerable. */
export type Enemy = Readonly<{
  boss: BossState | null;
  contactDamage: number;
  health: number;
  id: EnemyId;
  isBig: boolean;
  isFast: boolean;
  maxHealth: number;
  radius: number;
  spawnTicks: number;
  speed: number;
  staggerTicks: number;
  variant: number;
  walkFrame: number;
  walkTicks: number;
  x: number;
  y: number;
}>;

/** Who fired a bullet. */
export type BulletOwner = "enemy" | "player";

/** Circular motion around the player. */
export type Orbit = Readonly<{ angle: number; radius: number; speed: number }>;

/** A projectile; `explosionRadius` is null for non-explosive bullets. */
export type Bullet = Readonly<{
  area: number;
  color: string;
  damage: number;
  explosionRadius: number | null;
  hasReturned: boolean;
  hitEnemies: ReadonlyArray<EnemyId>;
  isBlackHole: boolean;
  isBoomerang: boolean;
  isLaser: boolean;
  life: number;
  maxLife: number;
  orbit: Orbit | null;
  owner: BulletOwner;
  pierces: boolean;
  size: number;
  velocity: Vector;
  x: number;
  y: number;
}>;

/** A visual particle; rings expand instead of moving. */
export type Particle = Readonly<{
  color: string;
  isRing: boolean;
  life: number;
  maxLife: number;
  size: number;
  velocity: Vector;
  x: number;
  y: number;
}>;

/** An experience crystal dropped by a killed enemy. */
export type Gem = Readonly<{
  life: number;
  value: number;
  velocity: Vector;
  x: number;
  y: number;
}>;

/** Rising score text in world space. */
export type FloatingText = Readonly<{
  color: string;
  isBig: boolean;
  life: number;
  text: string;
  x: number;
  y: number;
}>;

/** A boss chest waiting to be picked up. */
export type Chest = Readonly<{ animationTicks: number; x: number; y: number }>;

/** An equipped weapon; `cooldownTicks` is null until its first random delay is rolled. */
export type WeaponSlot = Readonly<{
  cooldownTicks: number | null;
  id: WeaponId;
  level: number;
}>;

/** Position and animation of the player; `facing` is 1 (right) or -1 (left). */
export type Player = Readonly<{
  facing: number;
  invulnerableTicks: number;
  radius: number;
  walkFrame: number;
  walkTicks: number;
  x: number;
  y: number;
}>;
