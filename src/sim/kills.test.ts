import {
  createTestBoss,
  createTestEnemy,
  createTestState,
  fixedRandom,
} from "./sim-fixtures";
import { describe, expect, it } from "vitest";
import { type Enemy, toEnemyId } from "./entities";
import { defeatEnemy } from "./kills";
import type { GameState } from "./game-state";

const NEUTRAL_ROLL = 0.5;
const random = fixedRandom(NEUTRAL_ROLL);
const WAVE = 3;
const SINGLE = 1;
const NONE = 0;
const MISSING_ID = 999;
const EXPECTED = {
  bigBlood: 30,
  bigGem: 9,
  bigPoints: 150,
  blood: 10,
  bossCoins: 162,
  bossPoints: 810,
  gem: 3,
  points: 30,
};

const withEnemy = (
  enemy: Enemy,
  progress: Partial<GameState["progress"]> = {},
): GameState => {
  const state = createTestState();

  return {
    ...state,
    enemies: [enemy],
    progress: { ...state.progress, wave: WAVE, ...progress },
  };
};

const kill = (state: GameState): ReturnType<typeof defeatEnemy> =>
  defeatEnemy(
    state,
    state.enemies.at(NONE)?.id ?? toEnemyId(MISSING_ID),
    random,
  );

describe("defeatEnemy zombies", (): void => {
  it("scores, counts and drops a gem", (): void => {
    const { events, state } = kill(withEnemy(createTestEnemy()));

    expect(events).toEqual([]);
    expect(state.enemies).toEqual([]);
    expect(state.progress).toMatchObject({
      combo: 1,
      earnedCoins: 3,
      kills: SINGLE,
      score: EXPECTED.points,
    });
    expect(state.gems.at(NONE)?.value).toBe(EXPECTED.gem);
    expect(state.floats.at(NONE)?.text).toBe(`+${EXPECTED.points}`);
    expect(state.particles).toHaveLength(EXPECTED.blood);
  });

  it("rewards big zombies more", (): void => {
    const { state } = kill(withEnemy(createTestEnemy({ isBig: true })));

    expect(state.progress.score).toBe(EXPECTED.bigPoints);
    expect(state.gems.at(NONE)?.value).toBe(EXPECTED.bigGem);
    expect(state.particles).toHaveLength(EXPECTED.bigBlood);
  });

  it("ignores enemies that are already gone", (): void => {
    const state = withEnemy(createTestEnemy());
    const result = defeatEnemy(state, toEnemyId(MISSING_ID), random);

    expect(result).toEqual({ events: [], state });
  });
});

describe("defeatEnemy combos", (): void => {
  it.each([
    { color: "#f1c40f", combo: 1, isBig: false, text: "×2 60" },
    { color: "#f39c12", combo: 2, isBig: false, text: "×3 90" },
    { color: "#ff6b6b", combo: 4, isBig: true, text: "×5 150" },
    { color: "#ff6b6b", combo: 20, isBig: true, text: "×8 240" },
  ])(
    "shows $text after a combo of $combo",
    ({ color, combo, isBig, text }): void => {
      const { state } = kill(withEnemy(createTestEnemy(), { combo }));

      expect(state.floats.at(NONE)).toMatchObject({ color, isBig, text });
    },
  );

  it("announces every fifth kill of a combo once", (): void => {
    const streak = kill(withEnemy(createTestEnemy(), { combo: 4 }));
    const repeated = kill(
      withEnemy(createTestEnemy(), { combo: 4, lastStreakShown: 5 }),
    );

    expect(streak.events).toEqual([{ combo: 5, kind: "streak" }]);
    expect(streak.state.progress).toMatchObject({
      bestCombo: 5,
      lastStreakShown: 5,
    });
    expect(repeated.events).toEqual([]);
  });
});

describe("defeatEnemy bosses", (): void => {
  it("drops a chest and pays out the boss reward", (): void => {
    const boss = createTestBoss("fleshMountain", { x: 10, y: 20 });
    const { events, state } = kill(withEnemy(boss));

    expect(events).toEqual([
      { kind: "boss-defeated" },
      { color: "#ffd700", kind: "banner", text: "BOSS BESIEGT! 🎁" },
    ]);
    expect(state.chests).toEqual([{ animationTicks: 0, x: 10, y: 20 }]);
    expect(state.progress).toMatchObject({
      earnedCoins: EXPECTED.bossCoins,
      score: EXPECTED.bossPoints,
    });
    expect(state.floats.at(NONE)?.text).toBe(`⭐+${EXPECTED.bossPoints}`);
  });
});
