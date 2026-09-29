import { type BossState, type Enemy, toEnemyId } from "./entities";
import {
  createTestBoss,
  createTestContext,
  createTestEnemy,
  createTestState,
  fixedRandom,
} from "./sim-fixtures";
import { describe, expect, it } from "vitest";
import { isBossActive, trySpawnBoss, updateBosses } from "./boss";
import { BOSS_TUNING } from "./tuning";
import type { BossId } from "../data/bosses";
import type { GameState } from "./game-state";

const NONE = 0;
const NEUTRAL_ROLL = 0.5;
const random = fixedRandom(NEUTRAL_ROLL);
const DISTANCE = 200;
const WAVE = { boss: 3, quiet: 4 };
const FLESH_MOUNTAIN_HEALTH = 612;
const EXPECTED = { gunVolley: 3, minions: 3, poisonRing: 10 };
const FROZEN = 10;
const SINGLE = 1;

const NEXT_FREE_ID = 2;

type BossTimers = Partial<Omit<BossState, "definition">>;

const withBoss = (
  bossId: BossId,
  overrides: Partial<Enemy> = {},
  timers: BossTimers = {},
): GameState => {
  const state = createTestState();
  const boss = createTestBoss(
    bossId,
    { x: state.player.x + DISTANCE, y: state.player.y, ...overrides },
    timers,
  );

  return {
    ...state,
    enemies: [boss],
    progress: { ...state.progress, nextEnemyId: NEXT_FREE_ID },
  };
};

const bossAfter = (state: GameState): Enemy | undefined =>
  updateBosses(state, random).state.enemies.at(NONE);

describe("trySpawnBoss", (): void => {
  it("spawns the wave boss away from the player", (): void => {
    const state = createTestState();
    const { events, state: spawned } = trySpawnBoss(
      { ...state, progress: { ...state.progress, wave: WAVE.boss } },
      random,
    );
    const [boss] = spawned.enemies;

    expect(isBossActive(spawned)).toBe(true);
    expect(boss?.health).toBeCloseTo(FLESH_MOUNTAIN_HEALTH);
    expect(boss?.spawnTicks).toBe(BOSS_TUNING.spawnTicks);
    expect(
      Math.hypot(
        (boss?.x ?? NONE) - state.player.x,
        (boss?.y ?? NONE) - state.player.y,
      ),
    ).toBeCloseTo(BOSS_TUNING.spawnDistance);
    expect(events.map((event) => event.kind)).toEqual([
      "boss-spawned",
      "banner",
    ]);
  });

  it("does nothing in quiet waves or while a boss lives", (): void => {
    const state = createTestState();
    const quiet = {
      ...state,
      progress: { ...state.progress, wave: WAVE.quiet },
    };
    const busy = {
      ...withBoss("fleshMountain"),
      progress: { ...state.progress, wave: WAVE.boss },
    };

    expect(trySpawnBoss(quiet, random).state).toBe(quiet);
    expect(trySpawnBoss(busy, random).state).toBe(busy);
    expect(isBossActive(state)).toBe(false);
  });
});

describe("updateBosses charge", (): void => {
  it("approaches slowly, then charges, then starts over", (): void => {
    const slow = withBoss("fleshMountain");
    const charging = withBoss(
      "fleshMountain",
      {},
      { chargeTicks: BOSS_TUNING.chargeStart },
    );
    const done = withBoss(
      "fleshMountain",
      {},
      { chargeTicks: BOSS_TUNING.chargeEnd },
    );
    const startX = slow.enemies.at(NONE)?.x ?? NONE;

    expect(startX - (bossAfter(slow)?.x ?? NONE)).toBeLessThan(
      startX - (bossAfter(charging)?.x ?? NONE),
    );
    expect(bossAfter(charging)?.boss?.chargeTicks).toBe(
      BOSS_TUNING.chargeStart + SINGLE,
    );
    expect(bossAfter(done)?.boss?.chargeTicks).toBe(NONE);
  });
});

describe("updateBosses spells", (): void => {
  it("summons three minions with fresh ids", (): void => {
    const ready = withBoss(
      "plaguePriest",
      {},
      { summonTicks: BOSS_TUNING.summonInterval },
    );
    const { events, state } = updateBosses(ready, random);
    const minions = state.enemies.filter((enemy) => enemy.boss === null);

    expect(minions).toHaveLength(EXPECTED.minions);
    const identifiers = new Set(state.enemies.map((enemy) => enemy.id));

    expect(identifiers.size).toBe(EXPECTED.minions + SINGLE);
    expect(events).toEqual([
      { color: "#9b59b6", kind: "banner", text: "💀 BESCHWÖRUNG!" },
    ]);
  });

  it("spits a poison ring", (): void => {
    const ready = withBoss(
      "poisonSpitter",
      {},
      { poisonTicks: BOSS_TUNING.poisonInterval },
    );
    const { bullets } = updateBosses(ready, random).state;

    expect(bullets).toHaveLength(EXPECTED.poisonRing);
    expect(bullets.every((bullet) => bullet.owner === "enemy")).toBe(true);
  });

  it("lets the nightmare shoot volleys as well", (): void => {
    const ready = withBoss(
      "nightmare",
      {},
      { gunTicks: BOSS_TUNING.gunInterval },
    );

    expect(updateBosses(ready, random).state.bullets).toHaveLength(
      EXPECTED.gunVolley,
    );
    expect(
      updateBosses(withBoss("deathKnight"), random).state.bullets,
    ).toHaveLength(NONE);
  });
});

describe("updateBosses restrictions", (): void => {
  it("pauses while staggered, frozen or spawning", (): void => {
    const staggered = withBoss("fleshMountain", { staggerTicks: FROZEN });
    const spawning = withBoss("fleshMountain", { spawnTicks: FROZEN });
    const frozen = withBoss("fleshMountain");
    const frozenState = {
      ...frozen,
      progress: { ...frozen.progress, freezeTicks: FROZEN },
    };
    const startX = staggered.enemies.at(NONE)?.x;

    expect(bossAfter(staggered)).toMatchObject({
      staggerTicks: FROZEN - SINGLE,
      x: startX,
    });
    expect(bossAfter(spawning)?.x).toBe(startX);
    expect(bossAfter(frozenState)?.x).toBe(startX);
  });

  it("hurts the player on contact", (): void => {
    const state = createTestState();
    const bystander = createTestEnemy({
      id: toEnemyId(NEXT_FREE_ID),
      spawnTicks: FROZEN,
    });
    const boss = createTestBoss("deathKnight", {
      x: state.player.x,
      y: state.player.y,
    });
    const touching = { ...state, enemies: [boss, bystander] };
    const { contactDamage } = createTestBoss("deathKnight");

    expect(updateBosses(touching, random).state.stats.health).toBe(
      state.stats.health - contactDamage,
    );
    expect(createTestContext().movement).toEqual({ x: NONE, y: NONE });
  });
});
