import { advanceBullet, updateBullets } from "./bullets";
import {
  createTestBullet,
  createTestContext,
  createTestEnemy,
  createTestState,
} from "./sim-fixtures";
import { describe, expect, it } from "vitest";
import type { Bullet } from "./entities";
import type { GameState } from "./game-state";

const NONE = 0;
const SINGLE = 1;
const SPEED = 3;
const LIFE = 10;
const HALF_LIFE = 5;
const ORBIT = { angle: 0, radius: 80, speed: 0.5 };
const DAMAGE = 7;
const OUTSIDE = -500;
const RADIUS = 40;
const INVULNERABLE = 10;

const withBullets = (
  state: GameState,
  bullets: ReadonlyArray<Bullet>,
): GameState => ({ ...state, bullets });

describe("advanceBullet", (): void => {
  it("flies straight and ages", (): void => {
    const bullet = createTestBullet({ velocity: { x: SPEED, y: NONE } });

    expect(advanceBullet(bullet, createTestState().player)).toMatchObject({
      life: LIFE - SINGLE,
      x: SPEED,
    });
  });

  it("orbits the player", (): void => {
    const { player } = createTestState();
    const orbiting = advanceBullet(createTestBullet({ orbit: ORBIT }), player);

    expect(
      Math.hypot(orbiting.x - player.x, orbiting.y - player.y),
    ).toBeCloseTo(ORBIT.radius);
    expect(orbiting.orbit?.angle).toBe(ORBIT.speed);
  });

  it("turns boomerangs around once at half life", (): void => {
    const boomerang = createTestBullet({
      isBoomerang: true,
      life: HALF_LIFE,
      velocity: { x: SPEED, y: NONE },
    });
    const turned = advanceBullet(boomerang, createTestState().player);

    expect(turned.hasReturned).toBe(true);
    expect(turned.velocity.x).toBe(-SPEED);
    expect(advanceBullet(turned, createTestState().player).velocity.x).toBe(
      -SPEED,
    );
  });
});

describe("updateBullets expiry", (): void => {
  it("removes spent and escaped bullets", (): void => {
    const state = withBullets(createTestState(), [
      createTestBullet({ life: SINGLE }),
      createTestBullet({ x: OUTSIDE }),
    ]);

    expect(updateBullets(state, createTestContext()).state.bullets).toEqual([]);
  });

  it("detonates spent explosives of the player only", (): void => {
    const state = createTestState();
    const enemy = createTestEnemy({ health: DAMAGE + DAMAGE, x: SINGLE });
    const bullets = [
      createTestBullet({
        damage: DAMAGE,
        explosionRadius: RADIUS,
        life: SINGLE,
      }),
      createTestBullet({
        damage: DAMAGE,
        explosionRadius: RADIUS,
        life: SINGLE,
        owner: "enemy",
      }),
    ];
    const updated = updateBullets(
      { ...withBullets(state, bullets), enemies: [enemy] },
      createTestContext(),
    ).state;

    expect(updated.enemies.at(NONE)?.health).toBe(DAMAGE);
  });
});

describe("updateBullets hits", (): void => {
  it("lets enemy bullets hurt a vulnerable player", (): void => {
    const state = createTestState();
    const shot = createTestBullet({
      damage: DAMAGE,
      owner: "enemy",
      x: state.player.x,
      y: state.player.y,
    });
    const hit = updateBullets(
      withBullets(state, [shot]),
      createTestContext(),
    ).state;
    const blocked = updateBullets(
      {
        ...withBullets(state, [shot]),
        player: { ...state.player, invulnerableTicks: INVULNERABLE },
      },
      createTestContext(),
    ).state;

    expect(hit.stats.health).toBe(state.stats.health - DAMAGE);
    expect(hit.bullets).toEqual([]);
    expect(blocked.bullets).toHaveLength(SINGLE);
  });
});

describe("updateBullets player hits", (): void => {
  it("consumes normal bullets and keeps piercing ones", (): void => {
    const enemy = createTestEnemy({ health: LIFE + LIFE });
    const state = { ...createTestState(), enemies: [enemy] };
    const normal = updateBullets(
      withBullets(state, [createTestBullet()]),
      createTestContext(),
    ).state;
    const piercing = updateBullets(
      withBullets(state, [createTestBullet({ pierces: true })]),
      createTestContext(),
    ).state;

    expect(normal.bullets).toEqual([]);
    expect(piercing.bullets.at(NONE)?.hitEnemies).toEqual([enemy.id]);
    expect(
      updateBullets(piercing, createTestContext()).state.enemies.at(NONE)
        ?.health,
    ).toBe(piercing.enemies.at(NONE)?.health);
  });

  it("lets bullets pass when nothing is in range", (): void => {
    const state = withBullets(createTestState(), [createTestBullet()]);

    expect(
      updateBullets(state, createTestContext()).state.bullets,
    ).toHaveLength(SINGLE);
  });
});
