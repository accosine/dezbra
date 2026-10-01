import {
  andThen,
  createBanner,
  type StepResult,
  withEvents,
  withoutEvents,
} from "./step-result";
import {
  animateEnemyWalk,
  collideEnemyWithBuildings,
  isTouchingPlayer,
  replaceEnemy,
} from "./enemy-motion";
import { BOSS_TUNING, PLAYER_TUNING } from "./tuning";
import {
  type BossAction,
  type BossEnemy,
  castSpells,
  charge,
  isBossEnemy,
} from "./boss-attacks";
import { clamp, FULL_TURN } from "../utils/math";
import { type Enemy, toEnemyId } from "./entities";
import { NONE, STEP } from "../utils/numbers";
import { damagePlayer } from "./player-damage";
import { findBossForWave } from "../data/bosses";
import type { GameState } from "./game-state";
import type { Random } from "../utils/random";

const ALERT_COLOR = "#ff4444";

const addMinions = (
  state: GameState,
  minions: ReadonlyArray<Enemy>,
): GameState => ({
  ...state,
  enemies: [
    ...state.enemies,
    ...minions.map((minion, index) => ({
      ...minion,
      id: toEnemyId(state.progress.nextEnemyId + index),
    })),
  ],
  progress: {
    ...state.progress,
    nextEnemyId: state.progress.nextEnemyId + minions.length,
  },
});

const applyAction = (state: GameState, action: BossAction): StepResult => {
  const boss = collideEnemyWithBuildings(state, action.boss);
  const withBullets = {
    ...state,
    bullets: [...state.bullets, ...action.bullets],
  };

  return withEvents(
    addMinions(replaceEnemy(withBullets, boss), action.minions),
    action.events,
  );
};

const attackPlayer = (
  result: StepResult,
  boss: Enemy,
  random: Random,
): StepResult =>
  isTouchingPlayer(result.state, boss, PLAYER_TUNING.bossContactPadding)
    ? andThen(result, (current) =>
        damagePlayer(current, boss.contactDamage, random),
      )
    : result;

const updateBoss = (
  state: GameState,
  boss: BossEnemy,
  random: Random,
): StepResult => {
  const walked = animateEnemyWalk(boss, BOSS_TUNING.walkFrameTicks);

  if (walked.staggerTicks > NONE) {
    return withoutEvents(
      replaceEnemy(state, {
        ...walked,
        staggerTicks: walked.staggerTicks - STEP,
      }),
    );
  }

  if (state.progress.freezeTicks > NONE) {
    return withoutEvents(replaceEnemy(state, walked));
  }

  const action =
    walked.boss.definition.ability === "charge"
      ? charge(state, walked)
      : castSpells(state, walked, random);
  const result = applyAction(state, action);

  return attackPlayer(
    result,
    collideEnemyWithBuildings(state, action.boss),
    random,
  );
};

/** Runs the special behavior of every boss that finished spawning. */
export const updateBosses = (state: GameState, random: Random): StepResult =>
  state.enemies
    .filter((enemy) => isBossEnemy(enemy))
    .filter((boss) => boss.spawnTicks <= NONE)
    .reduce<StepResult>(
      (result, boss) =>
        andThen(result, (current) => updateBoss(current, boss, random)),
      withoutEvents(state),
    );

/** Returns true while a boss is alive. */
export const isBossActive = (state: GameState): boolean =>
  state.enemies.some((enemy) => isBossEnemy(enemy));

const createBoss = (
  state: GameState,
  random: Random,
): BossEnemy | undefined => {
  const definition = findBossForWave(state.progress.wave);

  if (definition === undefined) {
    return undefined;
  }

  const angle = random() * FULL_TURN;
  const limit = state.map.worldSize - BOSS_TUNING.worldMargin;
  const health =
    definition.health *
    (STEP + state.progress.wave * BOSS_TUNING.healthPerWave);
  const place = (center: number, offset: number): number =>
    clamp(
      center + offset * BOSS_TUNING.spawnDistance,
      BOSS_TUNING.worldMargin,
      limit,
    );

  return {
    boss: {
      chargeTicks: NONE,
      definition,
      gunTicks: NONE,
      poisonTicks: NONE,
      summonTicks: NONE,
    },
    contactDamage: definition.contactDamage,
    health,
    id: toEnemyId(state.progress.nextEnemyId),
    isBig: true,
    isFast: false,
    maxHealth: health,
    radius: definition.size,
    spawnTicks: BOSS_TUNING.spawnTicks,
    speed: definition.speed,
    staggerTicks: NONE,
    variant: NONE,
    walkFrame: NONE,
    walkTicks: NONE,
    x: place(state.player.x, Math.cos(angle)),
    y: place(state.player.y, Math.sin(angle)),
  };
};

/** Spawns the boss of the current wave near the player, unless one is alive. */
export const trySpawnBoss = (state: GameState, random: Random): StepResult => {
  const boss = isBossActive(state) ? undefined : createBoss(state, random);

  if (boss === undefined) {
    return withoutEvents(state);
  }

  const { definition } = boss.boss;

  return withEvents(
    {
      ...state,
      enemies: [...state.enemies, boss],
      progress: {
        ...state.progress,
        nextEnemyId: state.progress.nextEnemyId + STEP,
      },
    },
    [
      { boss: definition, kind: "boss-spawned" },
      createBanner(
        `${definition.icon} ${definition.name} ERSCHEINT!`,
        ALERT_COLOR,
      ),
    ],
  );
};
