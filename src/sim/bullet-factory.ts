import type { Bullet, Orbit } from "./entities";
import type { GameState } from "./game-state";
import { WEAPON_TUNING } from "./tuning";

/** Parameters of a player bullet that differ between weapons. */
export type PlayerBulletSpec = Readonly<{
  angle: number;
  color: string;
  damage: number;
  explosionRadius: number | null;
  isBlackHole: boolean;
  isBoomerang: boolean;
  isLaser: boolean;
  life: number;
  orbit: Orbit | null;
  pierces: boolean;
  sizeMultiplier: number;
  speed: number;
}>;

const resolveExplosionRadius = (
  state: GameState,
  radius: number | null,
): number | null => {
  if (radius !== null) {
    return radius * state.stats.area;
  }

  return state.stats.hasExplosiveRounds
    ? WEAPON_TUNING.defaultExplosionRadius
    : null;
};

/** Creates a bullet at the player's position with the player's area and explosive perks. */
export const createPlayerBullet = (
  state: GameState,
  spec: PlayerBulletSpec,
): Bullet => ({
  area: state.stats.area,
  color: spec.color,
  damage: spec.damage,
  explosionRadius: resolveExplosionRadius(state, spec.explosionRadius),
  hasReturned: false,
  hitEnemies: [],
  isBlackHole: spec.isBlackHole,
  isBoomerang: spec.isBoomerang,
  isLaser: spec.isLaser,
  life: spec.life,
  maxLife: spec.life,
  orbit: spec.orbit,
  owner: "player",
  pierces: spec.pierces,
  size: spec.sizeMultiplier * state.stats.area,
  velocity: {
    x: Math.cos(spec.angle) * spec.speed,
    y: Math.sin(spec.angle) * spec.speed,
  },
  x: state.player.x,
  y: state.player.y,
});

/** Parameters of an enemy bullet. */
export type EnemyBulletSpec = Readonly<{
  angle: number;
  area: number;
  color: string;
  damage: number;
  life: number;
  size: number;
  speed: number;
  x: number;
  y: number;
}>;

/** Creates a boss projectile that only hurts the player. */
export const createEnemyBullet = (spec: EnemyBulletSpec): Bullet => ({
  area: spec.area,
  color: spec.color,
  damage: spec.damage,
  explosionRadius: null,
  hasReturned: false,
  hitEnemies: [],
  isBlackHole: false,
  isBoomerang: false,
  isLaser: false,
  life: spec.life,
  maxLife: spec.life,
  orbit: null,
  owner: "enemy",
  pierces: false,
  size: spec.size,
  velocity: {
    x: Math.cos(spec.angle) * spec.speed,
    y: Math.sin(spec.angle) * spec.speed,
  },
  x: spec.x,
  y: spec.y,
});
