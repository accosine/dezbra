import type * as Phaser from "phaser";
import { findNextUnlockHint, type Unlock } from "../save/unlocks";
import { isNewBestScore, recordRunEnd } from "../save/progress";
import { readSave, recordUnlocks, writeSave } from "./game-registry";
import { type RunSummary, summarizeRun } from "../sim/run-summary";
import type { GameState } from "../sim/game-state";

/** Result of a finished run for the game-over screen. */
export type RunReport = Readonly<{
  isNewBest: boolean;
  nextGoal: string | undefined;
  summary: RunSummary;
  unlocks: ReadonlyArray<Unlock>;
}>;

/** Credits the run to the progress, unlocks new content and returns the report. */
export const finalizeRun = (
  registry: Phaser.Data.DataManager,
  state: GameState,
): RunReport => {
  const summary = summarizeRun(state);
  const before = readSave(registry);

  writeSave(registry, recordRunEnd(before, summary));

  const unlocks = recordUnlocks(registry);

  return {
    isNewBest: isNewBestScore(before, summary.score),
    nextGoal: findNextUnlockHint(readSave(registry)),
    summary,
    unlocks,
  };
};
