import type { GamePhase, GameState } from "./game-state";
import { NONE } from "../utils/numbers";

/** Decides what the run waits for next: death first, then chests, then level-ups. */
export const resolvePhase = (state: GameState): GamePhase => {
  if (state.phase === "dead") {
    return "dead";
  }

  if (state.progress.pendingChests > NONE) {
    return "chest";
  }

  return state.progress.pendingLevelUps > NONE ? "upgrade" : "playing";
};

/** Returns the state with its phase resolved. */
export const withResolvedPhase = (state: GameState): GameState => ({
  ...state,
  phase: resolvePhase(state),
});
