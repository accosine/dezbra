import {
  andThen,
  createBanner,
  runStages,
  type Stage,
  withEvents,
  withoutEvents,
} from "./step-result";
import { createTestContext, createTestState } from "./sim-fixtures";
import { describe, expect, it } from "vitest";

const SCORE_BONUS = 10;
const BANNER = createBanner("WELLE 2", "#2ecc71");

const addScore: Stage = (state) =>
  withEvents(
    {
      ...state,
      progress: {
        ...state.progress,
        score: state.progress.score + SCORE_BONUS,
      },
    },
    [BANNER],
  );

describe("step results", (): void => {
  it("wraps a state without events", (): void => {
    const state = createTestState();

    expect(withoutEvents(state)).toEqual({ events: [], state });
  });

  it("chains follow-ups and keeps all events", (): void => {
    const state = createTestState();
    const chained = andThen(withEvents(state, [BANNER]), (next) =>
      runStages(next, [addScore], createTestContext()),
    );

    expect(chained.events).toEqual([BANNER, BANNER]);
    expect(chained.state.progress.score).toBe(SCORE_BONUS);
  });

  it("runs stages in order", (): void => {
    const result = runStages(
      createTestState(),
      [addScore, addScore],
      createTestContext(),
    );

    expect(result.state.progress.score).toBe(SCORE_BONUS + SCORE_BONUS);
    expect(result.events).toHaveLength([addScore, addScore].length);
  });

  it("creates banner events", (): void => {
    expect(BANNER).toEqual({
      color: "#2ecc71",
      kind: "banner",
      text: "WELLE 2",
    });
  });
});
