import { describe, expect, it } from "vitest";
import { createTestState } from "./sim-fixtures";
import type { GameState } from "./game-state";
import { resolvePhase } from "./phase";

const PENDING = 1;

const withPending = (chests: number, levelUps: number): GameState => {
  const state = createTestState();

  return {
    ...state,
    progress: {
      ...state.progress,
      pendingChests: chests,
      pendingLevelUps: levelUps,
    },
  };
};

describe("resolvePhase", (): void => {
  it.each([
    { chests: 0, expected: "playing", levelUps: 0 },
    { chests: 0, expected: "upgrade", levelUps: PENDING },
    { chests: PENDING, expected: "chest", levelUps: PENDING },
  ])("waits for $expected", ({ chests, expected, levelUps }): void => {
    expect(resolvePhase(withPending(chests, levelUps))).toBe(expected);
  });

  it("stays dead", (): void => {
    expect(
      resolvePhase({ ...withPending(PENDING, PENDING), phase: "dead" }),
    ).toBe("dead");
  });
});
