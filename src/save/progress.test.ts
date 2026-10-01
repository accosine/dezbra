import { describe, expect, it } from "vitest";
import {
  getProgressStatistics,
  isNewBestScore,
  recordBossKill,
  recordFusion,
  recordRunEnd,
  recordRunStart,
} from "./progress";
import { DEFAULT_SAVE_DATA } from "./save-data";

const SAVE = {
  ...DEFAULT_SAVE_DATA,
  bestScore: 1000,
  bossKills: 2,
  coins: 50,
  fusionsBuilt: 1,
  runsPlayed: 4,
  totalKills: 300,
};
const INCREMENT = 1;
const LOW_RUN = { coins: 12, kills: 40, score: 800 };
const HIGH_RUN = { coins: 30, kills: 90, score: 1500 };

describe("progress counters", (): void => {
  it("counts runs, boss kills and fusions", (): void => {
    expect(recordRunStart(SAVE).runsPlayed).toBe(SAVE.runsPlayed + INCREMENT);
    expect(recordBossKill(SAVE).bossKills).toBe(SAVE.bossKills + INCREMENT);
    expect(recordFusion(SAVE).fusionsBuilt).toBe(SAVE.fusionsBuilt + INCREMENT);
  });

  it("adds kills and coins but keeps a higher best score", (): void => {
    expect(recordRunEnd(SAVE, LOW_RUN)).toEqual({
      ...SAVE,
      coins: SAVE.coins + LOW_RUN.coins,
      totalKills: SAVE.totalKills + LOW_RUN.kills,
    });
  });

  it("raises the best score after a better run", (): void => {
    expect(isNewBestScore(SAVE, HIGH_RUN.score)).toBe(true);
    expect(isNewBestScore(SAVE, LOW_RUN.score)).toBe(false);
    expect(recordRunEnd(SAVE, HIGH_RUN).bestScore).toBe(HIGH_RUN.score);
  });

  it("exposes the unlock statistics", (): void => {
    expect(getProgressStatistics(SAVE)).toEqual({
      bestScore: SAVE.bestScore,
      bossKills: SAVE.bossKills,
      fusionsBuilt: SAVE.fusionsBuilt,
      runsPlayed: SAVE.runsPlayed,
      totalKills: SAVE.totalKills,
    });
  });
});
