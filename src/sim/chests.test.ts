import { describe, expect, it } from "vitest";
import { createTestState } from "./sim-fixtures";
import { updateChests } from "./chests";

const FAR = 100;
const SINGLE = 1;

describe("updateChests", (): void => {
  it("animates chests that are out of reach", (): void => {
    const state = createTestState();
    const chest = {
      animationTicks: 0,
      x: state.player.x + FAR,
      y: state.player.y,
    };
    const { events, state: updated } = updateChests({
      ...state,
      chests: [chest],
    });

    expect(events).toEqual([]);
    expect(updated.chests).toEqual([{ ...chest, animationTicks: SINGLE }]);
  });

  it("opens touched chests", (): void => {
    const state = createTestState();
    const chest = { animationTicks: 0, x: state.player.x, y: state.player.y };
    const { events, state: updated } = updateChests({
      ...state,
      chests: [chest],
    });

    expect(events).toEqual([{ kind: "chest-found" }]);
    expect(updated.chests).toEqual([]);
    expect(updated.progress.pendingChests).toBe(SINGLE);
  });
});
