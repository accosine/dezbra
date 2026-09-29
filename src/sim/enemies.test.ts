import { computeMaxEnemies, updateEnemies } from "./enemies";
import {
  createTestContext,
  createTestEnemy,
  createTestState,
  fixedRandom,
  sequenceRandom,
} from "./sim-fixtures";
import { describe, expect, it } from "vitest";
import { ENEMY_TUNING, PLAYER_TUNING } from "./tuning";
import type { Enemy } from "./entities";
import type { GameState } from "./game-state";

const NONE = 0;
const SINGLE = 1;
const ROLL = { big: 0.05, regular: 0.5 };
const WAVE = { cap: 20, first: 1, firstMax: 19, maxCap: 80 };
const SPAWN_INTERVAL_WAVE_ONE = 51;
const REGULAR_HEALTH = 5;
const BIG_HEALTH = 50;
const DISTANCE = 100;
const FROZEN = 10;
const SPAWNING_ENEMY = createTestEnemy({ spawnTicks: FROZEN });

const withProgress = (
  state: GameState,
  progress: Partial<GameState["progress"]>,
): GameState => ({
  ...state,
  progress: { ...state.progress, ...progress },
});

const readySpawner = (state: GameState): GameState =>
  withProgress(state, { spawnTicks: SPAWN_INTERVAL_WAVE_ONE - SINGLE });

const withEnemies = (
  state: GameState,
  enemies: ReadonlyArray<Enemy>,
): GameState => ({ ...state, enemies });

const enemyNearPlayer = (
  state: GameState,
  overrides: Partial<Enemy> = {},
): Enemy =>
  createTestEnemy({
    x: state.player.x + DISTANCE,
    y: state.player.y,
    ...overrides,
  });

describe("computeMaxEnemies", (): void => {
  it("grows with the wave up to the cap", (): void => {
    expect(computeMaxEnemies(WAVE.first)).toBe(WAVE.firstMax);
    expect(computeMaxEnemies(WAVE.cap)).toBe(WAVE.maxCap);
  });
});

describe("updateEnemies spawning", (): void => {
  it("spawns a zombie once the interval has passed", (): void => {
    const { state } = updateEnemies(
      readySpawner(createTestState()),
      createTestContext(fixedRandom(ROLL.regular)),
    );
    const [zombie] = state.enemies;

    expect(zombie).toMatchObject({
      health: REGULAR_HEALTH,
      isBig: false,
      isFast: false,
      spawnTicks: ENEMY_TUNING.spawnTicks - SINGLE,
    });
    expect(state.progress).toMatchObject({ nextEnemyId: 2, spawnTicks: NONE });
  });

  it("spawns big zombies on low rolls", (): void => {
    const { state } = updateEnemies(
      readySpawner(createTestState()),
      createTestContext(fixedRandom(ROLL.big)),
    );

    expect(state.enemies.at(NONE)).toMatchObject({
      health: BIG_HEALTH,
      isBig: true,
      radius: ENEMY_TUNING.bigRadius,
    });
  });
});

describe("updateEnemies spawn variants", (): void => {
  it("spawns fast zombies when the second roll hits", (): void => {
    const rolls = sequenceRandom([
      ROLL.regular,
      ROLL.regular,
      ROLL.regular,
      ROLL.big,
    ]);
    const { state } = updateEnemies(
      readySpawner(createTestState()),
      createTestContext(rolls),
    );

    expect(state.enemies.at(NONE)?.isFast).toBe(true);
  });

  it("waits while the interval runs or the wave is full", (): void => {
    const full = Array.from({ length: WAVE.firstMax }, () => SPAWNING_ENEMY);
    const waiting = updateEnemies(createTestState(), createTestContext()).state;
    const crowdedState = withEnemies(readySpawner(createTestState()), full);
    const crowded = updateEnemies(crowdedState, createTestContext()).state;

    expect(waiting.enemies).toHaveLength(NONE);
    expect(crowded.enemies).toHaveLength(WAVE.firstMax);
  });
});

describe("updateEnemies movement", (): void => {
  it("chases the player", (): void => {
    const state = createTestState();
    const enemy = enemyNearPlayer(state);
    const moved = updateEnemies(
      withEnemies(state, [enemy]),
      createTestContext(),
    ).state.enemies.at(NONE);

    expect(moved?.x).toBeCloseTo(enemy.x - enemy.speed);
  });

  it.each([
    { name: "spawning", overrides: { spawnTicks: 2 } },
    { name: "staggered", overrides: { staggerTicks: 2 } },
  ])("holds still while $name", ({ overrides }): void => {
    const state = createTestState();
    const enemy = enemyNearPlayer(state, overrides);
    const moved = updateEnemies(
      withEnemies(state, [enemy]),
      createTestContext(),
    ).state.enemies.at(NONE);

    expect(moved?.x).toBe(enemy.x);
  });
});

describe("updateEnemies freezing and animation", (): void => {
  it("holds still while frozen", (): void => {
    const state = withProgress(createTestState(), { freezeTicks: FROZEN });
    const enemy = enemyNearPlayer(state);

    expect(
      updateEnemies(
        withEnemies(state, [enemy]),
        createTestContext(),
      ).state.enemies.at(NONE)?.x,
    ).toBe(enemy.x);
  });

  it("animates the walk cycle", (): void => {
    const state = createTestState();
    const enemy = enemyNearPlayer(state, {
      walkTicks: ENEMY_TUNING.walkFrameTicks,
    });

    expect(
      updateEnemies(
        withEnemies(state, [enemy]),
        createTestContext(),
      ).state.enemies.at(NONE),
    ).toMatchObject({
      walkFrame: SINGLE,
      walkTicks: NONE,
    });
  });
});

describe("updateEnemies contact damage", (): void => {
  it("hurts the player once per invulnerability window", (): void => {
    const state = createTestState();
    const touching = [
      createTestEnemy({ x: state.player.x, y: state.player.y }),
      createTestEnemy({ x: state.player.x, y: state.player.y }),
      createTestEnemy({
        spawnTicks: FROZEN,
        x: state.player.x,
        y: state.player.y,
      }),
    ];
    const hurt = updateEnemies(
      withEnemies(state, touching),
      createTestContext(),
    ).state;

    expect(hurt.stats.health).toBe(
      state.stats.health - ENEMY_TUNING.contactDamage,
    );
    expect(hurt.player.invulnerableTicks).toBe(PLAYER_TUNING.invulnerableTicks);
  });
});
