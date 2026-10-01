import { advanceFloats, advanceParticles } from "./particles";
import {
  runStages,
  type Stage,
  type StepContext,
  type StepResult,
  withoutEvents,
} from "./step-result";
import type { GameState } from "./game-state";
import { movePlayer } from "./player-movement";
import { STEP } from "../utils/numbers";
import { TICKS_PER_SECOND } from "./tuning";
import { updateBullets } from "./bullets";
import { updateChests } from "./chests";
import { updateEnemies } from "./enemies";
import { updateGems } from "./experience";
import { updatePlayerTimers } from "./player-timers";
import { updateRunTimers } from "./run-timers";
import { updateWave } from "./waves";
import { updateWeapons } from "./weapons";
import { withResolvedPhase } from "./phase";

const STAGES: ReadonlyArray<Stage> = [
  (state): StepResult =>
    withoutEvents({
      ...state,
      progress: { ...state.progress, frame: state.progress.frame + STEP },
    }),
  (state, context): StepResult =>
    withoutEvents(
      updatePlayerTimers(movePlayer(state, context.movement), context.movement),
    ),
  (state): StepResult => updateRunTimers(state),
  updateWave,
  updateEnemies,
  (state, context): StepResult =>
    withoutEvents(updateWeapons(state, context.random)),
  updateBullets,
  (state): StepResult => updateGems(state),
  (state): StepResult => updateChests(state),
  (state): StepResult =>
    withoutEvents({
      ...state,
      floats: advanceFloats(state.floats),
      particles: advanceParticles(state.particles),
    }),
];

/** Advances a playing run by one tick (1/60 s); other phases stay unchanged. */
export const stepGame = (
  state: GameState,
  context: StepContext,
): StepResult => {
  if (state.phase !== "playing") {
    return withoutEvents(state);
  }

  const result = runStages(state, STAGES, context);

  return { ...result, state: withResolvedPhase(result.state) };
};

/** Returns the whole seconds the run has been played. */
export const getElapsedSeconds = (state: GameState): number =>
  Math.floor(state.progress.frame / TICKS_PER_SECOND);
