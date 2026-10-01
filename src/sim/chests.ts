import { type GameEvent, type StepResult, withEvents } from "./step-result";
import { distanceBetween } from "../utils/math";
import type { GameState } from "./game-state";
import { PICKUP_TUNING } from "./tuning";
import { STEP } from "../utils/numbers";

/** Animates chests; touching one queues a chest reward. */
export const updateChests = (state: GameState): StepResult => {
  const isTouched = (chest: GameState["chests"][number]): boolean =>
    distanceBetween(chest, state.player) < PICKUP_TUNING.chestRadius;
  const found = state.chests.filter((chest) => isTouched(chest));
  const events = found.map((): GameEvent => ({ kind: "chest-found" }));

  return withEvents(
    {
      ...state,
      chests: state.chests
        .filter((chest) => !isTouched(chest))
        .map((chest) => ({
          ...chest,
          animationTicks: chest.animationTicks + STEP,
        })),
      progress: {
        ...state.progress,
        pendingChests: state.progress.pendingChests + found.length,
      },
    },
    events,
  );
};
