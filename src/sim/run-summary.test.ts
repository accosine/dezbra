import { describe, expect, it } from "vitest";
import { createTestState } from "./sim-fixtures";
import { summarizeRun } from "./run-summary";

const FRAMES = 3725;
const SECONDS = 62;
const PROGRESS = { bestCombo: 9, earnedCoins: 40, kills: 77, score: 12_345 };

describe("summarizeRun", (): void => {
  it("collects the numbers of the run and marks fusions", (): void => {
    const state = createTestState({ characterId: "ghost" });
    const finished = {
      ...state,
      progress: { ...state.progress, ...PROGRESS, frame: FRAMES },
      weapons: [
        ...state.weapons,
        { cooldownTicks: null, id: "laser" as const, level: 1 },
      ],
    };

    expect(summarizeRun(finished)).toEqual({
      bestCombo: PROGRESS.bestCombo,
      coins: PROGRESS.earnedCoins,
      kills: PROGRESS.kills,
      score: PROGRESS.score,
      seconds: SECONDS,
      weaponIcons: "🌋✨  🔴",
    });
  });
});
