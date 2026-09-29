import {
  addParticles,
  createBloodParticles,
  createParticle,
  createRingParticle,
} from "./particles";
import { andThen, type StepResult, withoutEvents } from "./step-result";
import { angleBetween, distanceBetween } from "../utils/math";
import type { Bullet, Enemy, EnemyId } from "./entities";
import { COMBAT_TUNING, ENEMY_TUNING } from "./tuning";
import { moveEnemyAlong, replaceEnemy } from "./enemy-motion";
import { type Random, randomChance } from "../utils/random";
import { defeatEnemy } from "./kills";
import type { GameState } from "./game-state";
import { NONE } from "../utils/numbers";
import { ZERO_VECTOR } from "../utils/vector";

/** A blast that damages every enemy within its radius. */
export type Explosion = Readonly<{
  color: string;
  damage: number;
  radius: number;
  x: number;
  y: number;
}>;

const defeatIfDead = (
  state: GameState,
  enemyId: EnemyId,
  random: Random,
): StepResult => {
  const enemy = state.enemies.find((candidate) => candidate.id === enemyId);

  return enemy !== undefined && enemy.health <= NONE
    ? defeatEnemy(state, enemyId, random)
    : withoutEvents(state);
};

/** Damages every vulnerable enemy in range and removes those that die. */
export const explode = (
  state: GameState,
  explosion: Explosion,
  random: Random,
): StepResult => {
  const withEffects = addParticles(state, [
    ...createBloodParticles(explosion, COMBAT_TUNING.explosionBlood, random),
    createRingParticle(explosion, explosion.color, {
      life: COMBAT_TUNING.explosionRingLife,
      size: explosion.radius + explosion.radius,
    }),
  ]);
  const victims = withEffects.enemies.filter(
    (enemy) =>
      enemy.spawnTicks <= NONE &&
      distanceBetween(enemy, explosion) < explosion.radius,
  );
  const damaged = victims.reduce(
    (current, enemy) =>
      replaceEnemy(current, {
        ...enemy,
        health: enemy.health - explosion.damage,
      }),
    withEffects,
  );

  return victims.reduce<StepResult>(
    (result, enemy) =>
      andThen(result, (current) => defeatIfDead(current, enemy.id, random)),
    withoutEvents(damaged),
  );
};

const rollDamage = (
  state: GameState,
  bullet: Bullet,
  random: Random,
): number =>
  state.stats.critChance > NONE && randomChance(random, state.stats.critChance)
    ? bullet.damage * COMBAT_TUNING.critMultiplier
    : bullet.damage;

const computeStagger = (state: GameState, bullet: Bullet): number =>
  bullet.orbit !== null && state.character.id === "zara"
    ? COMBAT_TUNING.zaraOrbStagger
    : ENEMY_TUNING.staggerOnHit;

const staggerEnemy = (
  state: GameState,
  bullet: Bullet,
  enemy: Enemy,
): Enemy => ({
  ...(bullet.isBlackHole
    ? moveEnemyAlong(
        enemy,
        angleBetween(enemy, bullet),
        COMBAT_TUNING.blackHolePull,
      )
    : enemy),
  staggerTicks: computeStagger(state, bullet),
});

const createHitEffects = (
  bullet: Bullet,
  random: Random,
): GameState["particles"] => [
  ...createBloodParticles(bullet, COMBAT_TUNING.hitBlood, random),
  ...(bullet.isLaser
    ? [
        createParticle({
          color: bullet.color,
          life: COMBAT_TUNING.laserSparkLife,
          size: COMBAT_TUNING.laserSparkSize,
          velocity: ZERO_VECTOR,
          x: bullet.x,
          y: bullet.y,
        }),
      ]
    : []),
];

const healByVampirism = (state: GameState, damage: number): GameState => ({
  ...state,
  stats: {
    ...state.stats,
    health: Math.min(
      state.stats.maxHealth,
      state.stats.health + damage * state.stats.vampirism,
    ),
  },
});

/** Applies one bullet hit: damage, stagger, pull, effects, vampirism and explosion. */
export const hitEnemy = (
  state: GameState,
  hit: Readonly<{ bullet: Bullet; enemy: Enemy }>,
  random: Random,
): StepResult => {
  const damage = rollDamage(state, hit.bullet, random);
  const enemy = staggerEnemy(state, hit.bullet, hit.enemy);
  const wounded = replaceEnemy(state, {
    ...enemy,
    health: enemy.health - damage,
  });
  const withEffects = addParticles(
    healByVampirism(wounded, damage),
    createHitEffects(hit.bullet, random),
  );
  const exploded =
    hit.bullet.explosionRadius === null
      ? withoutEvents(withEffects)
      : explode(
          withEffects,
          {
            color: hit.bullet.color,
            damage: hit.bullet.damage * COMBAT_TUNING.explosionOnHitRatio,
            radius: hit.bullet.explosionRadius,
            x: hit.bullet.x,
            y: hit.bullet.y,
          },
          random,
        );

  return andThen(exploded, (current) =>
    defeatIfDead(current, hit.enemy.id, random),
  );
};

/** Returns true if the bullet stays alive after hitting an enemy. */
export const survivesHit = (bullet: Bullet): boolean =>
  bullet.pierces ||
  bullet.orbit !== null ||
  bullet.isLaser ||
  bullet.isBoomerang;

/** Finds the most recently spawned enemy the bullet touches and has not hit before. */
export const findBulletTarget = (
  state: GameState,
  bullet: Bullet,
): Enemy | undefined =>
  state.enemies.findLast(
    (enemy) =>
      enemy.spawnTicks <= NONE &&
      !bullet.hitEnemies.includes(enemy.id) &&
      distanceBetween(bullet, enemy) < bullet.size + enemy.radius,
  );

/** Marks an enemy as hit by a surviving bullet. */
export const rememberHit = (bullet: Bullet, enemyId: EnemyId): Bullet => ({
  ...bullet,
  hitEnemies: [...bullet.hitEnemies, enemyId],
});
