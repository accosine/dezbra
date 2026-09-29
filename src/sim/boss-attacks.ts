import { angleBetween, FULL_TURN } from "../utils/math";
import { BOSS_TUNING, ENEMY_TUNING } from "./tuning";
import { type BossState, type Bullet, type Enemy, toEnemyId } from "./entities";
import { createBanner, type GameEvent } from "./step-result";
import { NONE, STEP } from "../utils/numbers";
import { type Random, randomCentered } from "../utils/random";
import { createEnemyBullet } from "./bullet-factory";
import type { GameState } from "./game-state";
import { moveEnemyAlong } from "./enemy-motion";

const SUMMON_COLOR = "#9b59b6";

/** An enemy that is known to be a boss. */
export type BossEnemy = Enemy & Readonly<{ boss: BossState }>;

/** Result of one boss tick: the moved boss plus spawned minions, bullets and events. */
export type BossAction = Readonly<{
  boss: BossEnemy;
  bullets: ReadonlyArray<Bullet>;
  events: ReadonlyArray<GameEvent>;
  minions: ReadonlyArray<Enemy>;
}>;

type AttackTimer = Readonly<{ fires: boolean; ticks: number }>;

const NO_ATTACK: AttackTimer = { fires: false, ticks: NONE };

/** Narrows an enemy to a boss. */
export const isBossEnemy = (enemy: Enemy): enemy is BossEnemy =>
  enemy.boss !== null;

const tickAttack = (ticks: number, interval: number): AttackTimer => {
  const next = ticks + STEP;

  return next > interval
    ? { fires: true, ticks: NONE }
    : { fires: false, ticks: next };
};

const createMinion = (boss: Enemy, angle: number): Enemy => ({
  boss: null,
  contactDamage: ENEMY_TUNING.contactDamage,
  health: BOSS_TUNING.minionHealth,
  id: toEnemyId(NONE),
  isBig: false,
  isFast: true,
  maxHealth: BOSS_TUNING.minionHealth,
  radius: ENEMY_TUNING.radius,
  spawnTicks: BOSS_TUNING.minionSpawnTicks,
  speed: BOSS_TUNING.minionSpeed,
  staggerTicks: NONE,
  variant: BOSS_TUNING.minionVariant,
  walkFrame: NONE,
  walkTicks: NONE,
  x: boss.x + Math.cos(angle) * BOSS_TUNING.minionDistance,
  y: boss.y + Math.sin(angle) * BOSS_TUNING.minionDistance,
});

const createPoisonRing = (boss: Enemy): ReadonlyArray<Bullet> =>
  Array.from({ length: BOSS_TUNING.poisonCount }, (_bullet, index) =>
    createEnemyBullet({
      angle: (index / BOSS_TUNING.poisonCount) * FULL_TURN,
      area: BOSS_TUNING.poisonArea,
      color: BOSS_TUNING.poisonColor,
      damage: BOSS_TUNING.poisonDamage,
      life: BOSS_TUNING.poisonLife,
      size: BOSS_TUNING.enemyBulletSize,
      speed: BOSS_TUNING.poisonSpeed,
      x: boss.x,
      y: boss.y,
    }),
  );

const createGunVolley = (
  state: GameState,
  boss: Enemy,
): ReadonlyArray<Bullet> =>
  Array.from({ length: BOSS_TUNING.gunCount }, (_bullet, index) =>
    createEnemyBullet({
      angle:
        angleBetween(boss, state.player) +
        (index - STEP) * BOSS_TUNING.gunSpread,
      area: STEP,
      color: BOSS_TUNING.gunColor,
      damage: BOSS_TUNING.gunDamage,
      life: BOSS_TUNING.gunLife,
      size: BOSS_TUNING.enemyBulletSize,
      speed: BOSS_TUNING.gunSpeed,
      x: boss.x,
      y: boss.y,
    }),
  );

/** Slow approach, then a fast charge; used by the "charge" boss. */
export const charge = (state: GameState, boss: BossEnemy): BossAction => {
  const chargeTicks = boss.boss.chargeTicks + STEP;
  const isCharging = chargeTicks > BOSS_TUNING.chargeStart;
  const moved = moveEnemyAlong(
    boss,
    angleBetween(boss, state.player),
    boss.speed *
      BOSS_TUNING[isCharging ? "chargeMultiplier" : "approachMultiplier"],
  );
  const nextChargeTicks =
    chargeTicks > BOSS_TUNING.chargeEnd ? NONE : chargeTicks;

  return {
    boss: { ...moved, boss: { ...boss.boss, chargeTicks: nextChargeTicks } },
    bullets: [],
    events: [],
    minions: [],
  };
};

const tickSpellTimers = (
  boss: BossEnemy,
): Readonly<{ gun: AttackTimer; poison: AttackTimer; summon: AttackTimer }> => {
  const { ability } = boss.boss.definition;
  const hasPoison = ability === "poison" || ability === "all";

  return {
    gun:
      ability === "all"
        ? tickAttack(boss.boss.gunTicks, BOSS_TUNING.gunInterval)
        : NO_ATTACK,
    poison: hasPoison
      ? tickAttack(boss.boss.poisonTicks, BOSS_TUNING.poisonInterval)
      : NO_ATTACK,
    summon: tickAttack(boss.boss.summonTicks, BOSS_TUNING.summonInterval),
  };
};

/** Chase plus summons, poison rings and gun volleys depending on the ability. */
export const castSpells = (
  state: GameState,
  boss: BossEnemy,
  random: Random,
): BossAction => {
  const angle = angleBetween(boss, state.player);
  const timers = tickSpellTimers(boss);
  const moved = moveEnemyAlong(boss, angle, boss.speed);
  const minionCount = timers.summon.fires ? BOSS_TUNING.minionCount : NONE;

  return {
    boss: {
      ...moved,
      boss: {
        ...boss.boss,
        gunTicks: timers.gun.ticks,
        poisonTicks: timers.poison.ticks,
        summonTicks: timers.summon.ticks,
      },
    },
    bullets: [
      ...(timers.poison.fires ? createPoisonRing(moved) : []),
      ...(timers.gun.fires ? createGunVolley(state, moved) : []),
    ],
    events: timers.summon.fires
      ? [createBanner("💀 BESCHWÖRUNG!", SUMMON_COLOR)]
      : [],
    minions: Array.from({ length: minionCount }, () =>
      createMinion(
        moved,
        angle + randomCentered(random, BOSS_TUNING.minionSpread),
      ),
    ),
  };
};
