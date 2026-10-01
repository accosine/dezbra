import { describe, expect, it } from "vitest";
import { createTestState } from "./sim-fixtures";
import type { GameState } from "./game-state";
import { PLAYER_TUNING } from "./tuning";
import { updatePlayerTimers } from "./player-timers";

const NONE = 0;
const STILL = { x: 0, y: 0 };
const DASH = { x: 0.8, y: 0 };
const CREEP = { x: 0.3, y: 0.3 };
const SOLDIER_SHIELD_FRAME = 3600;
const REGENERATION = { amount: 3, damagedHealth: 50 };
const SHIELD_ALMOST_READY = 1;

const withStats = (
  state: GameState,
  stats: Partial<GameState["stats"]>,
): GameState => ({
  ...state,
  stats: { ...state.stats, ...stats },
});

const tick = (state: GameState, times: number): GameState =>
  Array.from({ length: times }).reduce<GameState>(
    (current) => updatePlayerTimers(current, STILL),
    state,
  );

describe("updatePlayerTimers health", (): void => {
  it("regenerates once per second up to the maximum", (): void => {
    const hurt = withStats(createTestState(), {
      health: REGENERATION.damagedHealth,
      regeneration: REGENERATION.amount,
    });
    const healed = tick(hurt, PLAYER_TUNING.regenerationInterval);

    expect(healed.stats.health).toBe(
      REGENERATION.damagedHealth + REGENERATION.amount,
    );
    expect(
      tick(healed, PLAYER_TUNING.regenerationInterval - SHIELD_ALMOST_READY)
        .stats.health,
    ).toBe(healed.stats.health);
  });

  it("counts invulnerability down to zero", (): void => {
    const state = createTestState();
    const invulnerable = {
      ...state,
      player: { ...state.player, invulnerableTicks: 1 },
    };

    expect(
      tick(invulnerable, PLAYER_TUNING.walkFrameTicks).player.invulnerableTicks,
    ).toBe(NONE);
  });

  it("recharges a broken shield after its cooldown", (): void => {
    const broken = withStats(createTestState({ characterId: "hans" }), {
      hasShield: false,
      shieldCooldownTicks: SHIELD_ALMOST_READY + SHIELD_ALMOST_READY,
    });

    expect(tick(broken, SHIELD_ALMOST_READY).stats.hasShield).toBe(false);
    expect(
      tick(broken, SHIELD_ALMOST_READY + SHIELD_ALMOST_READY).stats.hasShield,
    ).toBe(true);
  });
});

describe("updatePlayerTimers passives", (): void => {
  it("gives the soldier a shield every full minute", (): void => {
    const state = createTestState();
    const atMinute = {
      ...state,
      progress: { ...state.progress, frame: SOLDIER_SHIELD_FRAME },
    };
    const beforeMinute = {
      ...state,
      progress: {
        ...state.progress,
        frame: SOLDIER_SHIELD_FRAME - SHIELD_ALMOST_READY,
      },
    };

    expect(updatePlayerTimers(atMinute, STILL).stats.hasShield).toBe(true);
    expect(updatePlayerTimers(beforeMinute, STILL).stats.hasShield).toBe(false);
    expect(updatePlayerTimers(state, STILL).stats.hasShield).toBe(false);
  });

  it("makes Shade X briefly invulnerable while dashing", (): void => {
    const ghost = createTestState({ characterId: "ghost" });

    expect(updatePlayerTimers(ghost, DASH).player.invulnerableTicks).toBe(
      PLAYER_TUNING.ghostInvulnerableTicks,
    );
    expect(updatePlayerTimers(ghost, CREEP).player.invulnerableTicks).toBe(
      NONE,
    );
    expect(
      updatePlayerTimers(createTestState(), DASH).player.invulnerableTicks,
    ).toBe(NONE);
  });
});
