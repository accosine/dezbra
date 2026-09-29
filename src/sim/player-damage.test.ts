import { createTestState, fixedRandom } from "./sim-fixtures";
import { describe, expect, it } from "vitest";
import { damagePlayer } from "./player-damage";
import type { GameState } from "./game-state";
import { PLAYER_TUNING } from "./tuning";

const HIT = 20;
const HANS_HIT = 13;
const FRACTIONAL_HIT = 12.9;
const NEUTRAL_ROLL = 0.5;
const LAST_INDEX = -1;
const NONE = 0;
const SHAKE_PER_DAMAGE = 0.5;
const random = fixedRandom(NEUTRAL_ROLL);

const withStats = (
  state: GameState,
  stats: Partial<GameState["stats"]>,
): GameState => ({
  ...state,
  stats: { ...state.stats, ...stats },
});

describe("damagePlayer hits", (): void => {
  it("reduces health, grants invulnerability, shakes and breaks the combo", (): void => {
    const state = createTestState();
    const combo = {
      ...state,
      progress: { ...state.progress, combo: 7, comboTicks: 50 },
    };
    const { events, state: hit } = damagePlayer(combo, HIT, random);

    expect(events).toEqual([]);
    expect(hit.stats.health).toBe(state.stats.maxHealth - HIT);
    expect(hit.player.invulnerableTicks).toBe(PLAYER_TUNING.invulnerableTicks);
    expect(hit.progress).toMatchObject({
      combo: 0,
      comboTicks: 0,
      shakeMagnitude: HIT * SHAKE_PER_DAMAGE,
    });
  });

  it("floors damage and lets Iron Hans take only 65 percent", (): void => {
    const hans = createTestState({ characterId: "hans" });
    const unshielded = withStats(hans, { hasShield: false });

    expect(
      damagePlayer(createTestState(), FRACTIONAL_HIT, random).state.stats
        .health,
    ).toBe(createTestState().stats.maxHealth - Math.floor(FRACTIONAL_HIT));
    expect(damagePlayer(unshielded, HIT, random).state.stats.health).toBe(
      hans.stats.maxHealth - HANS_HIT,
    );
  });

  it("lets a shield absorb the hit and start its cooldown", (): void => {
    const shielded = withStats(createTestState(), { hasShield: true });
    const { state } = damagePlayer(shielded, HIT, random);

    expect(state.stats).toMatchObject({
      hasShield: false,
      health: shielded.stats.maxHealth,
      shieldCooldownTicks: PLAYER_TUNING.shieldCooldownTicks,
    });
    expect(state.particles.at(LAST_INDEX)?.isRing).toBe(true);
  });
});

describe("damagePlayer deaths", (): void => {
  it("revives once with a third of the health", (): void => {
    const fragile = withStats(createTestState(), {
      hasRevive: true,
      health: 5,
    });
    const { events, state } = damagePlayer(fragile, HIT, random);

    expect(events).toEqual([
      { color: "#ffd700", kind: "banner", text: "☠️ WIEDERKEHR!" },
    ]);
    expect(state.stats).toMatchObject({ health: 32, isReviveUsed: true });
    expect(state.phase).toBe("playing");
  });

  it("kills the player when no revive is left", (): void => {
    const fragile = withStats(createTestState(), {
      hasRevive: true,
      health: 5,
      isReviveUsed: true,
    });
    const { events, state } = damagePlayer(fragile, HIT, random);

    expect(events).toEqual([{ kind: "player-died" }]);
    expect(state.phase).toBe("dead");
    expect(state.particles.length).toBeGreaterThan(NONE);
  });
});
