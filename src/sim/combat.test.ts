import { COMBAT_TUNING, ENEMY_TUNING } from "./tuning";
import {
  createTestBullet,
  createTestEnemy,
  createTestState,
  fixedRandom,
} from "./sim-fixtures";
import { describe, expect, it } from "vitest";
import { type Enemy, toEnemyId } from "./entities";
import {
  explode,
  findBulletTarget,
  hitEnemy,
  rememberHit,
  survivesHit,
} from "./combat";
import type { GameState } from "./game-state";

const ROLL = { high: 0.9, low: 0.1 };
const NONE = 0;
const SINGLE = 1;
const HEALTH = 20;
const DAMAGE = 5;
const RADIUS = 50;
const FAR = 200;
const CRIT_CHANCE = 0.5;
const VAMPIRISM = 0.5;
const HURT_HEALTH = 50;
const IDS = { first: 1, second: 2, third: 3 };

const stateWith = (
  enemies: ReadonlyArray<Enemy>,
  stats: Partial<GameState["stats"]> = {},
): GameState => {
  const state = createTestState();

  return { ...state, enemies, stats: { ...state.stats, ...stats } };
};

const enemyAt = (id: number, x: number, health = HEALTH): Enemy =>
  createTestEnemy({ health, id: toEnemyId(id), x, y: 0 });

describe("explode", (): void => {
  it("damages every vulnerable enemy in range and kills the weak", (): void => {
    const enemies = [
      enemyAt(IDS.first, NONE, DAMAGE),
      enemyAt(IDS.second, RADIUS - SINGLE),
      enemyAt(IDS.third, FAR),
      createTestEnemy({
        health: HEALTH,
        id: toEnemyId(IDS.third + SINGLE),
        spawnTicks: IDS.third,
      }),
    ];
    const { state } = explode(
      stateWith(enemies),
      { color: "#fff000", damage: DAMAGE, radius: RADIUS, x: 0, y: 0 },
      fixedRandom(ROLL.low),
    );

    expect(state.enemies.map((enemy) => enemy.health)).toEqual([
      HEALTH - DAMAGE,
      HEALTH,
      HEALTH,
    ]);
    expect(state.progress.kills).toBe(SINGLE);
    expect(
      state.particles.some(
        (particle) => particle.isRing && particle.size === RADIUS + RADIUS,
      ),
    ).toBe(true);
  });
});

describe("hitEnemy damage", (): void => {
  it("wounds and staggers the enemy", (): void => {
    const enemy = enemyAt(IDS.first, NONE);
    const { state } = hitEnemy(
      stateWith([enemy]),
      { bullet: createTestBullet({ damage: DAMAGE }), enemy },
      fixedRandom(ROLL.low),
    );

    expect(state.enemies.at(NONE)).toMatchObject({
      health: HEALTH - DAMAGE,
      staggerTicks: ENEMY_TUNING.staggerOnHit,
    });
  });

  it.each([
    {
      expected: HEALTH - DAMAGE * COMBAT_TUNING.critMultiplier,
      roll: ROLL.low,
    },
    { expected: HEALTH - DAMAGE, roll: ROLL.high },
  ])("rolls critical hits ($roll)", ({ expected, roll }): void => {
    const enemy = enemyAt(IDS.first, NONE);
    const state = stateWith([enemy], { critChance: CRIT_CHANCE });

    expect(
      hitEnemy(
        state,
        { bullet: createTestBullet({ damage: DAMAGE }), enemy },
        fixedRandom(roll),
      ).state.enemies.at(NONE)?.health,
    ).toBe(expected);
  });
});

describe("hitEnemy outcomes", (): void => {
  it("kills enemies that drop to zero", (): void => {
    const enemy = enemyAt(IDS.first, NONE, DAMAGE);

    expect(
      hitEnemy(
        stateWith([enemy]),
        { bullet: createTestBullet({ damage: DAMAGE }), enemy },
        fixedRandom(ROLL.low),
      ).state.enemies,
    ).toEqual([]);
  });

  it("heals the player through vampirism", (): void => {
    const enemy = enemyAt(IDS.first, NONE);
    const state = stateWith([enemy], {
      health: HURT_HEALTH,
      vampirism: VAMPIRISM,
    });

    expect(
      hitEnemy(
        state,
        { bullet: createTestBullet({ damage: DAMAGE }), enemy },
        fixedRandom(ROLL.low),
      ).state.stats.health,
    ).toBe(HURT_HEALTH + DAMAGE * VAMPIRISM);
  });
});

describe("hitEnemy special bullets", (): void => {
  it("lets Zara's orbs stagger longer", (): void => {
    const enemy = enemyAt(IDS.first, NONE);
    const zara = {
      ...createTestState({ characterId: "zara" }),
      enemies: [enemy],
    };
    const orb = createTestBullet({
      orbit: { angle: 0, radius: 80, speed: 0.07 },
    });

    expect(
      hitEnemy(
        zara,
        { bullet: orb, enemy },
        fixedRandom(ROLL.low),
      ).state.enemies.at(NONE)?.staggerTicks,
    ).toBe(COMBAT_TUNING.zaraOrbStagger);
  });

  it("pulls enemies towards black holes", (): void => {
    const enemy = enemyAt(IDS.first, NONE);
    const hole = createTestBullet({ isBlackHole: true, x: RADIUS });

    expect(
      hitEnemy(
        stateWith([enemy]),
        { bullet: hole, enemy },
        fixedRandom(ROLL.low),
      ).state.enemies.at(NONE)?.x,
    ).toBeCloseTo(COMBAT_TUNING.blackHolePull);
  });
});

describe("hitEnemy effects", (): void => {
  it("sparks lasers and detonates explosive bullets", (): void => {
    const enemy = enemyAt(IDS.first, NONE);
    const neighbor = enemyAt(IDS.second, SINGLE);
    const bullet = createTestBullet({
      damage: DAMAGE + DAMAGE,
      explosionRadius: RADIUS,
      isLaser: true,
    });
    const { state } = hitEnemy(
      stateWith([enemy, neighbor]),
      { bullet, enemy },
      fixedRandom(ROLL.low),
    );

    expect(state.enemies.at(SINGLE)?.health).toBe(
      HEALTH - (DAMAGE + DAMAGE) * COMBAT_TUNING.explosionOnHitRatio,
    );
    expect(
      state.particles.some(
        (particle) => particle.size === COMBAT_TUNING.laserSparkSize,
      ),
    ).toBe(true);
  });
});

describe("bullet targeting", (): void => {
  it("prefers the newest touching enemy it has not hit yet", (): void => {
    const older = enemyAt(IDS.first, NONE);
    const newer = enemyAt(IDS.second, NONE);
    const spawning = createTestEnemy({
      id: toEnemyId(IDS.third),
      spawnTicks: IDS.third,
    });
    const state = stateWith([older, newer, spawning]);
    const bullet = createTestBullet();

    expect(findBulletTarget(state, bullet)?.id).toBe(newer.id);
    expect(findBulletTarget(state, rememberHit(bullet, newer.id))?.id).toBe(
      older.id,
    );
    expect(
      findBulletTarget(state, createTestBullet({ x: FAR })),
    ).toBeUndefined();
  });
});

describe("bullet survival", (): void => {
  it.each([
    { expected: false, overrides: {} },
    { expected: true, overrides: { pierces: true } },
    { expected: true, overrides: { isLaser: true } },
    { expected: true, overrides: { isBoomerang: true } },
    { expected: true, overrides: { orbit: { angle: 0, radius: 1, speed: 1 } } },
  ])("keeps flying after a hit: $expected", ({ expected, overrides }): void => {
    expect(survivesHit(createTestBullet(overrides))).toBe(expected);
  });
});
