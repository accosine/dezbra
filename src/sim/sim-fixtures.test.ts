import {
  createTestBoss,
  createTestEnemy,
  createTestState,
  fixedRandom,
  requireEnemy,
  sequenceRandom,
} from "./sim-fixtures";
import { describe, expect, it } from "vitest";
import { toEnemyId } from "./entities";

const ROLL = { high: 0.9, low: 0.1 };
const MISSING_ENEMY_ID = 99;
const NEUTRAL_ROLL = 0.5;

describe("test fixtures", (): void => {
  it("cycles through a random sequence", (): void => {
    const random = sequenceRandom([ROLL.low, ROLL.high]);

    expect([random(), random(), random()]).toEqual([
      ROLL.low,
      ROLL.high,
      ROLL.low,
    ]);
  });

  it("repeats a fixed roll", (): void => {
    const random = fixedRandom(ROLL.high);

    expect([random(), random()]).toEqual([ROLL.high, ROLL.high]);
  });

  it("falls back to a neutral roll for an empty sequence", (): void => {
    expect(sequenceRandom([])()).toBe(NEUTRAL_ROLL);
  });

  it("finds enemies or fails loudly", (): void => {
    const enemy = createTestEnemy();
    const state = { ...createTestState(), enemies: [enemy] };

    expect(requireEnemy(state, enemy.id)).toBe(enemy);
    expect(() => requireEnemy(state, toEnemyId(MISSING_ENEMY_ID))).toThrow(
      Error,
    );
  });

  it("creates bosses from the catalog", (): void => {
    expect(createTestBoss("fleshMountain").boss?.definition.name).toBe(
      "FLEISCHBERG",
    );
  });

  it("falls back to the soldier for unknown characters", (): void => {
    expect(createTestState().character.id).toBe("soldier");
  });
});
