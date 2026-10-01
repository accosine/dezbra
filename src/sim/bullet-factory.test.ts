import {
  createEnemyBullet,
  createPlayerBullet,
  type PlayerBulletSpec,
} from "./bullet-factory";
import { describe, expect, it } from "vitest";
import { createTestState } from "./sim-fixtures";
import type { GameState } from "./game-state";
import { WEAPON_TUNING } from "./tuning";

const AREA = 1.5;
const SPEC: PlayerBulletSpec = {
  angle: 0,
  color: "#85c1e9",
  damage: 9,
  explosionRadius: null,
  isBlackHole: false,
  isBoomerang: false,
  isLaser: false,
  life: 64,
  orbit: null,
  pierces: false,
  sizeMultiplier: 4,
  speed: 10,
};
const GRENADE_RADIUS = 68;
const ENEMY_SPEC = { ...SPEC, area: 1, size: 5, x: 3, y: 4 };

const withArea = (
  state: GameState,
  hasExplosiveRounds: boolean,
): GameState => ({
  ...state,
  stats: { ...state.stats, area: AREA, hasExplosiveRounds },
});

describe("createPlayerBullet", (): void => {
  it("starts at the player and flies along the angle", (): void => {
    const state = createTestState();
    const bullet = createPlayerBullet(state, SPEC);

    expect(bullet).toMatchObject({
      maxLife: SPEC.life,
      owner: "player",
      x: state.player.x,
      y: state.player.y,
    });
    expect(bullet.velocity).toEqual({ x: SPEC.speed, y: 0 });
  });

  it("scales size and explosions with the area", (): void => {
    const state = withArea(createTestState(), false);

    expect(createPlayerBullet(state, SPEC)).toMatchObject({
      explosionRadius: null,
      size: SPEC.sizeMultiplier * AREA,
    });
    expect(
      createPlayerBullet(state, { ...SPEC, explosionRadius: GRENADE_RADIUS })
        .explosionRadius,
    ).toBe(GRENADE_RADIUS * AREA);
  });

  it("makes every bullet explosive with the explosive perk", (): void => {
    const explosive = withArea(createTestState(), true);

    expect(createPlayerBullet(explosive, SPEC).explosionRadius).toBe(
      WEAPON_TUNING.defaultExplosionRadius,
    );
  });
});

describe("createEnemyBullet", (): void => {
  it("creates a projectile owned by the enemy", (): void => {
    const bullet = createEnemyBullet(ENEMY_SPEC);

    expect(bullet).toMatchObject({
      owner: "enemy",
      pierces: false,
      x: 3,
      y: 4,
    });
  });
});
