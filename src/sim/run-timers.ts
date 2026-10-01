import {
  createBanner,
  type StepResult,
  withEvents,
  withoutEvents,
} from "./step-result";
import type { GameState, RunProgress } from "./game-state";
import { NONE, STEP } from "../utils/numbers";
import { RUN_TUNING } from "./tuning";

const FREEZE_COLOR = "#4fc3f7";

const countDown = (ticks: number): number => Math.max(NONE, ticks - STEP);

const updateCombo = (progress: RunProgress): RunProgress => {
  if (progress.comboTicks <= NONE) {
    return progress;
  }

  const comboTicks = progress.comboTicks - STEP;

  return comboTicks > NONE
    ? { ...progress, comboTicks }
    : { ...progress, combo: NONE, comboTicks, lastStreakShown: NONE };
};

const decayShake = (magnitude: number): number =>
  magnitude > RUN_TUNING.shakeMinimum
    ? magnitude * RUN_TUNING.shakeDecay
    : NONE;

/** Freezes all regular enemies for three seconds. */
export const freezeEnemies = (state: GameState): StepResult =>
  withEvents(
    {
      ...state,
      progress: { ...state.progress, freezeTicks: RUN_TUNING.freezeTicks },
    },
    [createBanner("⏸️ ZEITSTOPP!", FREEZE_COLOR)],
  );

const updateTimeLock = (state: GameState): StepResult => {
  if (!state.stats.hasTimeLock) {
    return withoutEvents(state);
  }

  const timeLockTicks = state.progress.timeLockTicks - STEP;

  if (timeLockTicks > NONE) {
    return withoutEvents({
      ...state,
      progress: { ...state.progress, timeLockTicks },
    });
  }

  return freezeEnemies({
    ...state,
    progress: { ...state.progress, timeLockTicks: RUN_TUNING.timeLockInterval },
  });
};

/** Advances freeze, combo, screen shake, level flash and the time lock perk. */
export const updateRunTimers = (state: GameState): StepResult => {
  const { progress } = state;

  return updateTimeLock({
    ...state,
    progress: {
      ...updateCombo(progress),
      freezeTicks: countDown(progress.freezeTicks),
      levelFlashTicks: countDown(progress.levelFlashTicks),
      shakeMagnitude: decayShake(progress.shakeMagnitude),
    },
  });
};
