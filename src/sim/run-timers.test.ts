import { describe, expect, it } from "vitest";
import { freezeEnemies, updateRunTimers } from "./run-timers";
import { createTestState } from "./sim-fixtures";
import type { GameState } from "./game-state";
import { RUN_TUNING } from "./tuning";

const ACTIVE_COMBO = { combo: 6, comboTicks: 2, lastStreakShown: 5 };
const SHAKE = { strong: 10, weak: 0.1 };
const LAST_TICK = 1;
const NONE = 0;

const withProgress = (progress: Partial<GameState["progress"]>): GameState => {
  const state = createTestState();

  return { ...state, progress: { ...state.progress, ...progress } };
};

describe("updateRunTimers", (): void => {
  it("keeps a combo alive until its timer runs out", (): void => {
    const running = updateRunTimers(withProgress(ACTIVE_COMBO)).state.progress;
    const expired = updateRunTimers(
      withProgress({ ...ACTIVE_COMBO, comboTicks: LAST_TICK }),
    ).state.progress;

    expect(running).toMatchObject({
      combo: ACTIVE_COMBO.combo,
      comboTicks: LAST_TICK,
    });
    expect(expired).toMatchObject({
      combo: 0,
      comboTicks: 0,
      lastStreakShown: 0,
    });
  });

  it("decays screen shake and counts down freeze and level flash", (): void => {
    const strong = updateRunTimers(
      withProgress({
        freezeTicks: LAST_TICK,
        levelFlashTicks: LAST_TICK,
        shakeMagnitude: SHAKE.strong,
      }),
    ).state.progress;

    expect(strong).toMatchObject({ freezeTicks: 0, levelFlashTicks: 0 });
    expect(strong.shakeMagnitude).toBeCloseTo(
      SHAKE.strong * RUN_TUNING.shakeDecay,
    );
    expect(
      updateRunTimers(withProgress({ shakeMagnitude: SHAKE.weak })).state
        .progress.shakeMagnitude,
    ).toBe(NONE);
  });
});

describe("time lock", (): void => {
  it("freezes enemies every twenty seconds once owned", (): void => {
    const owned = withProgress({ timeLockTicks: LAST_TICK });
    const withPerk = { ...owned, stats: { ...owned.stats, hasTimeLock: true } };
    const { events, state } = updateRunTimers(withPerk);

    expect(events).toEqual([
      { color: "#4fc3f7", kind: "banner", text: "⏸️ ZEITSTOPP!" },
    ]);
    expect(state.progress).toMatchObject({
      freezeTicks: RUN_TUNING.freezeTicks,
      timeLockTicks: RUN_TUNING.timeLockInterval,
    });
    expect(updateRunTimers(state).events).toEqual([]);
  });

  it("does nothing without the perk", (): void => {
    expect(
      updateRunTimers(withProgress({ timeLockTicks: LAST_TICK })).events,
    ).toEqual([]);
  });

  it("freezes on demand", (): void => {
    expect(freezeEnemies(createTestState()).state.progress.freezeTicks).toBe(
      RUN_TUNING.freezeTicks,
    );
  });
});
