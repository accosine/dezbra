import { createTestEnemy, createTestState, fixedRandom } from "./sim-fixtures";
import { describe, expect, it } from "vitest";
import { fireWeapon } from "./weapon-fire";
import type { GameState } from "./game-state";
import type { WeaponId } from "../data/weapons";

const NEUTRAL_ROLL = 0.5;
const random = fixedRandom(NEUTRAL_ROLL);
const OFFSET = 100;
const FIRST = 0;
const NONE = 0;
const NAPALM_RADIUS = 72;
const FACING_LEFT = -1;
const COUNTS = {
  magicLevelThree: 7,
  shotgunWithExtra: 6,
  tempestWithExtra: 12,
};
const LEVEL_THREE = 3;
const EXTRA = 1;
const BONUS_DAMAGE = { expected: 20.16, multiplier: 1.6 };

const fire = (state: GameState, weaponId: WeaponId, level = EXTRA): GameState =>
  fireWeapon(state, { cooldownTicks: 0, id: weaponId, level }, random);

const withEnemyAt = (state: GameState, x: number, y: number): GameState => ({
  ...state,
  enemies: [createTestEnemy({ x, y })],
});

const withStats = (
  state: GameState,
  stats: Partial<GameState["stats"]>,
): GameState => ({
  ...state,
  stats: { ...state.stats, ...stats },
});

describe("fireWeapon aiming", (): void => {
  it("shoots at the nearest enemy", (): void => {
    const state = createTestState();
    const [bullet] = fire(
      withEnemyAt(state, state.player.x, state.player.y + OFFSET),
      "pistol",
    ).bullets;

    expect(bullet?.velocity.x).toBeCloseTo(NONE);
    expect(bullet?.velocity.y).toBeGreaterThan(NONE);
  });

  it("shoots in the facing direction without enemies", (): void => {
    const state = createTestState();
    const facingLeft = {
      ...state,
      player: { ...state.player, facing: FACING_LEFT },
    };

    expect(
      fire(facingLeft, "pistol").bullets.at(FIRST)?.velocity.x,
    ).toBeLessThan(NONE);
  });

  it("prefers the closest of several enemies", (): void => {
    const state = createTestState();
    const enemies = [
      createTestEnemy({
        x: state.player.x - OFFSET - OFFSET,
        y: state.player.y,
      }),
      createTestEnemy({ x: state.player.x + OFFSET, y: state.player.y }),
      createTestEnemy({
        x: state.player.x - OFFSET - OFFSET - OFFSET,
        y: state.player.y,
      }),
    ];

    expect(
      fire({ ...state, enemies }, "pistol").bullets.at(FIRST)?.velocity.x,
    ).toBeGreaterThan(NONE);
  });
});

describe("fireWeapon napalm", (): void => {
  it("drops napalm on enemies or random spots", (): void => {
    const state = createTestState();
    const [onEnemy] = fire(
      withEnemyAt(state, state.player.x + OFFSET, state.player.y),
      "napalm",
    ).bullets;
    const [scattered] = fire(state, "napalm").bullets;

    expect(onEnemy?.velocity.y).toBeCloseTo(NONE);
    expect(scattered?.explosionRadius).toBe(NAPALM_RADIUS);
  });
});

describe("fireWeapon volleys", (): void => {
  it("adds extra projectiles and level-based orbs", (): void => {
    const state = withStats(createTestState(), { extraProjectiles: EXTRA });

    expect(fire(state, "shotgun").bullets).toHaveLength(
      COUNTS.shotgunWithExtra,
    );
    expect(fire(state, "tempest").bullets).toHaveLength(
      COUNTS.tempestWithExtra,
    );
    expect(fire(createTestState(), "magic", LEVEL_THREE).bullets).toHaveLength(
      COUNTS.magicLevelThree,
    );
  });

  it("applies pierce rules per weapon", (): void => {
    const perk = withStats(createTestState(), { hasPierce: true });

    expect(fire(createTestState(), "pistol").bullets.at(FIRST)?.pierces).toBe(
      false,
    );
    expect(fire(perk, "pistol").bullets.at(FIRST)?.pierces).toBe(true);
    expect(fire(createTestState(), "sniper").bullets.at(FIRST)?.pierces).toBe(
      true,
    );
    expect(fire(perk, "grenade").bullets.at(FIRST)?.pierces).toBe(false);
  });

  it("scales damage with level and multiplier and flashes the muzzle", (): void => {
    const state = withStats(createTestState(), {
      damageMultiplier: BONUS_DAMAGE.multiplier,
    });
    const fired = fire(state, "pistol", LEVEL_THREE);

    expect(fired.bullets.at(FIRST)?.damage).toBeCloseTo(BONUS_DAMAGE.expected);
    expect(fired.particles).toHaveLength(EXTRA);
  });

  it("creates orbiting bullets for magic", (): void => {
    expect(
      fire(createTestState(), "magic").bullets.at(FIRST)?.orbit,
    ).not.toBeNull();
    expect(
      fire(createTestState(), "pistol").bullets.at(FIRST)?.orbit,
    ).toBeNull();
  });
});
