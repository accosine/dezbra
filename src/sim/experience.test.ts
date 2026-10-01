import { describe, expect, it } from "vitest";
import { gainExperience, updateGems } from "./experience";
import { PICKUP_TUNING, RUN_TUNING } from "./tuning";
import { createTestState } from "./sim-fixtures";
import type { GameState } from "./game-state";
import type { Gem } from "./entities";

const NONE = 0;
const SINGLE = 1;
const START_XP = 30;
const XP = { enough: 35, huge: 200, small: 10 };
const GEM_VALUE = 4;
const FAR = 500;
const NEAR = 50;
const LAST_TICK = 1;
const XP_MULTIPLIER = 2;

const gemAt = (
  state: GameState,
  offset: number,
  overrides: Partial<Gem> = {},
): Gem => ({
  life: 100,
  value: GEM_VALUE,
  velocity: { x: 0, y: 0 },
  x: state.player.x + offset,
  y: state.player.y,
  ...overrides,
});

describe("gainExperience", (): void => {
  it("collects experience below the next level", (): void => {
    const { events, state } = gainExperience(createTestState(), XP.small);

    expect(events).toEqual([]);
    expect(state.progress).toMatchObject({ level: 1, xp: XP.small });
  });

  it("levels up, carries the rest over and raises the requirement", (): void => {
    const { events, state } = gainExperience(createTestState(), XP.enough);

    expect(events).toEqual([{ kind: "level-up" }]);
    expect(state.progress).toMatchObject({
      level: 2,
      levelFlashTicks: RUN_TUNING.levelFlashTicks,
      pendingLevelUps: SINGLE,
      xp: XP.enough - START_XP,
      xpToNextLevel: Math.round(START_XP * RUN_TUNING.xpGrowth),
    });
  });

  it("queues several level-ups at once and applies the multiplier", (): void => {
    const state = createTestState();
    const boosted = {
      ...state,
      stats: { ...state.stats, xpMultiplier: XP_MULTIPLIER },
    };

    expect(
      gainExperience(boosted, XP.huge).state.progress.pendingLevelUps,
    ).toBeGreaterThan(SINGLE);
  });
});

describe("updateGems", (): void => {
  it("collects touching gems with the map bonus", (): void => {
    const state = createTestState({ mapId: "wasteland" });
    const collected = updateGems({
      ...state,
      gems: [gemAt(state, NONE)],
    }).state;

    expect(collected.gems).toEqual([]);
    expect(collected.progress.xp).toBe(GEM_VALUE * state.map.xpMultiplier);
  });

  it("pulls gems inside the magnet radius and lets others drift", (): void => {
    const state = createTestState();
    const near = gemAt(state, NEAR);
    const far = gemAt(state, FAR, { velocity: { x: 1, y: 0 } });
    const [pulled, drifting] = updateGems({ ...state, gems: [near, far] }).state
      .gems;

    expect(pulled?.x).toBeLessThan(near.x);
    expect(drifting?.x).toBe(far.x + SINGLE);
    expect(drifting?.velocity.x).toBeCloseTo(PICKUP_TUNING.gemFriction);
  });

  it("removes gems that time out", (): void => {
    const state = createTestState();

    expect(
      updateGems({ ...state, gems: [gemAt(state, FAR, { life: LAST_TICK })] })
        .state.gems,
    ).toEqual([]);
  });
});
