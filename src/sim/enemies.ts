import {
  andThen,
  type StepContext,
  type StepResult,
  withoutEvents,
} from "./step-result";
import { angleBetween, clamp, FULL_TURN } from "../utils/math";
import {
  animateEnemyWalk,
  collideEnemyWithBuildings,
  isTouchingPlayer,
  moveEnemyAlong,
} from "./enemy-motion";
import { type Enemy, toEnemyId } from "./entities";
import { ENEMY_TUNING, PLAYER_TUNING, WAVE_TUNING } from "./tuning";
import { NONE, STEP } from "../utils/numbers";
import { type Random, randomChance, randomInteger } from "../utils/random";
import { damagePlayer } from "./player-damage";
import type { GameState } from "./game-state";
import { updateBosses } from "./boss";

/** Maximum number of regular enemies alive in a wave. */
export const computeMaxEnemies = (wave: number): number =>
  Math.min(
    WAVE_TUNING.maxEnemiesBase + wave * WAVE_TUNING.maxEnemiesPerWave,
    WAVE_TUNING.maxEnemiesCap,
  );

const computeSpawnInterval = (wave: number): number =>
  Math.max(
    WAVE_TUNING.spawnIntervalMinimum,
    WAVE_TUNING.spawnIntervalBase - wave * WAVE_TUNING.spawnIntervalPerWave,
  );

const createZombie = (state: GameState, random: Random): Enemy => {
  const { player, progress } = state;
  const distance =
    ENEMY_TUNING.spawnDistanceMinimum +
    random() * ENEMY_TUNING.spawnDistanceRange;
  const angle = random() * FULL_TURN;
  const limit = state.map.worldSize - ENEMY_TUNING.worldMargin;
  const isBig = randomChance(
    random,
    ENEMY_TUNING.bigChanceBase + progress.wave * ENEMY_TUNING.bigChancePerWave,
  );
  const isFast = !isBig && randomChance(random, ENEMY_TUNING.fastChance);
  const health =
    (isBig ? ENEMY_TUNING.bigHealthMultiplier : STEP) *
    (ENEMY_TUNING.healthBase +
      Math.floor(progress.wave * ENEMY_TUNING.healthPerWave)) *
    state.map.enemyMultiplier;
  const speed =
    ENEMY_TUNING[isFast ? "fastSpeed" : "normalSpeed"] +
    random() * ENEMY_TUNING.speedJitter +
    progress.wave * ENEMY_TUNING.speedPerWave;

  return {
    boss: null,
    contactDamage: ENEMY_TUNING[isBig ? "bigContactDamage" : "contactDamage"],
    health,
    id: toEnemyId(progress.nextEnemyId),
    isBig,
    isFast,
    maxHealth: health,
    radius: ENEMY_TUNING[isBig ? "bigRadius" : "radius"],
    spawnTicks: ENEMY_TUNING.spawnTicks,
    speed,
    staggerTicks: NONE,
    variant: randomInteger(random, ENEMY_TUNING.variants),
    walkFrame: NONE,
    walkTicks: randomInteger(random, ENEMY_TUNING.walkTicksJitter),
    x: clamp(
      player.x + Math.cos(angle) * distance,
      ENEMY_TUNING.worldMargin,
      limit,
    ),
    y: clamp(
      player.y + Math.sin(angle) * distance,
      ENEMY_TUNING.worldMargin,
      limit,
    ),
  };
};

const spawnEnemies = (state: GameState, random: Random): GameState => {
  const { progress } = state;
  const spawnTicks = progress.spawnTicks + STEP;
  const regularCount = state.enemies.filter(
    (enemy) => enemy.boss === null,
  ).length;

  if (
    spawnTicks < computeSpawnInterval(progress.wave) ||
    regularCount >= computeMaxEnemies(progress.wave)
  ) {
    return { ...state, progress: { ...progress, spawnTicks } };
  }

  return {
    ...state,
    enemies: [...state.enemies, createZombie(state, random)],
    progress: {
      ...progress,
      nextEnemyId: progress.nextEnemyId + STEP,
      spawnTicks: NONE,
    },
  };
};

const moveEnemy = (state: GameState, enemy: Enemy): Enemy => {
  if (enemy.spawnTicks > NONE) {
    return { ...enemy, spawnTicks: enemy.spawnTicks - STEP };
  }

  const isFrozen = state.progress.freezeTicks > NONE && enemy.boss === null;
  const angle = angleBetween(enemy, state.player);
  const chased = isFrozen ? enemy : moveEnemyAlong(enemy, angle, enemy.speed);
  const moved =
    enemy.staggerTicks > NONE
      ? { ...enemy, staggerTicks: enemy.staggerTicks - STEP }
      : chased;
  const walking = animateEnemyWalk(moved, ENEMY_TUNING.walkFrameTicks);

  return isFrozen ? walking : collideEnemyWithBuildings(state, walking);
};

const applyContactDamage = (state: GameState, random: Random): StepResult =>
  state.enemies
    .filter((enemy) => enemy.boss === null && enemy.spawnTicks <= NONE)
    .reduce<StepResult>(
      (result, enemy) =>
        isTouchingPlayer(result.state, enemy, PLAYER_TUNING.contactPadding)
          ? andThen(result, (current) =>
              damagePlayer(current, enemy.contactDamage, random),
            )
          : result,
      withoutEvents(state),
    );

/** Spawns zombies, moves every enemy, applies contact damage and runs boss behavior. */
export const updateEnemies = (
  state: GameState,
  context: StepContext,
): StepResult => {
  const spawned = spawnEnemies(state, context.random);
  const moved = {
    ...spawned,
    enemies: spawned.enemies.map((enemy) => moveEnemy(spawned, enemy)),
  };

  return andThen(applyContactDamage(moved, context.random), (current) =>
    updateBosses(current, context.random),
  );
};
