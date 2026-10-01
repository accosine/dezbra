import { applyLoot, createLootOffers } from "./loot";
import { createSeededRandom, type Random } from "../utils/random";
import { createTestContext, createTestState } from "./sim-fixtures";
import { describe, expect, it } from "vitest";
import { getElapsedSeconds, stepGame } from "./step";
import { TICKS_PER_SECOND, WAVE_TUNING } from "./tuning";
import { applyUpgrade } from "./apply-upgrade";
import { createUpgradeOffers } from "./upgrade-offers";
import type { GameState } from "./game-state";

const SEED = 2024;
const SINGLE = 1;
const NONE = 0;
const RIGHT = { x: 1, y: 0 };
const STILL = { x: 0, y: 0 };
const SECOND_WAVE = 2;
const TANK_HEALTH = 100_000;
const TICK_LIMIT = WAVE_TUNING.waveTicks + TICKS_PER_SECOND;

const resolveChoice = (state: GameState, random: Random): GameState => {
  if (state.phase === "upgrade") {
    const [offer] = createUpgradeOffers(state, random);

    return offer === undefined ? state : applyUpgrade(state, offer).state;
  }

  const [loot] = createLootOffers(random);

  return state.phase === "chest" && loot !== undefined
    ? applyLoot(state, loot.id).state
    : state;
};

const playUntil = (
  state: GameState,
  isDone: (current: GameState) => boolean,
): GameState => {
  const random = createSeededRandom(SEED);
  let current = state;
  let ticks = NONE;

  while (!isDone(current) && ticks < TICK_LIMIT && current.phase !== "dead") {
    current = resolveChoice(
      stepGame(current, { movement: STILL, random }).state,
      random,
    );
    ticks += SINGLE;
  }

  return current;
};

describe("stepGame", (): void => {
  it("advances the frame and moves the player", (): void => {
    const state = createTestState();
    const next = stepGame(state, {
      ...createTestContext(),
      movement: RIGHT,
    }).state;

    expect(next.progress.frame).toBe(SINGLE);
    expect(next.player.x).toBeGreaterThan(state.player.x);
  });

  it("leaves paused runs untouched", (): void => {
    const paused: GameState = { ...createTestState(), phase: "upgrade" };

    expect(stepGame(paused, createTestContext()).state).toBe(paused);
  });

  it("plays through a whole wave with kills, level-ups and a new wave", (): void => {
    const state = createTestState();
    const sturdy = {
      ...state,
      stats: { ...state.stats, health: TANK_HEALTH, maxHealth: TANK_HEALTH },
    };
    const played = playUntil(
      sturdy,
      (current) => current.progress.wave >= SECOND_WAVE,
    );

    expect(played.progress.wave).toBe(SECOND_WAVE);
    expect(played.progress.kills).toBeGreaterThan(NONE);
    expect(played.progress.level).toBeGreaterThan(SINGLE);
    expect(getElapsedSeconds(played)).toBe(
      WAVE_TUNING.waveTicks / TICKS_PER_SECOND,
    );
  });
});
