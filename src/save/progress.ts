import type { ProgressStatistics } from "../data/unlock-requirement";
import type { SaveData } from "./save-data";

/** What a finished run contributes to the lifetime progress. */
export type RunResult = Readonly<{
  coins: number;
  kills: number;
  score: number;
}>;

const INCREMENT = 1;

/** Counts a started run. */
export const recordRunStart = (save: SaveData): SaveData => ({
  ...save,
  runsPlayed: save.runsPlayed + INCREMENT,
});

/** Counts a defeated boss. */
export const recordBossKill = (save: SaveData): SaveData => ({
  ...save,
  bossKills: save.bossKills + INCREMENT,
});

/** Counts a built fusion weapon. */
export const recordFusion = (save: SaveData): SaveData => ({
  ...save,
  fusionsBuilt: save.fusionsBuilt + INCREMENT,
});

/** Returns true if the score beats the stored best score. */
export const isNewBestScore = (save: SaveData, score: number): boolean =>
  score > save.bestScore;

/** Adds kills and coins of a finished run and keeps the best score. */
export const recordRunEnd = (save: SaveData, result: RunResult): SaveData => ({
  ...save,
  bestScore: Math.max(save.bestScore, result.score),
  coins: save.coins + result.coins,
  totalKills: save.totalKills + result.kills,
});

/** Extracts the statistics that unlock requirements are checked against. */
export const getProgressStatistics = (save: SaveData): ProgressStatistics => ({
  bestScore: save.bestScore,
  bossKills: save.bossKills,
  fusionsBuilt: save.fusionsBuilt,
  runsPlayed: save.runsPlayed,
  totalKills: save.totalKills,
});
