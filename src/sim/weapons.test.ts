import { computeFireInterval, updateWeapons } from "./weapons";
import { createTestState, fixedRandom } from "./sim-fixtures";
import { describe, expect, it } from "vitest";
import type { GameState } from "./game-state";
import { WEAPONS } from "../data/weapons";

const NEUTRAL_ROLL = 0.5;
const random = fixedRandom(NEUTRAL_ROLL);
const READY = 1;
const WAITING = 5;
const HIGH_LEVEL = 30;
const BLITZ_LEVEL_TEN_INTERVAL = 5;
const MINIMUM_INTERVAL = 4;
const TINY_COOLDOWN = 0.01;
const SINGLE = 1;
const NONE = 0;

const withCooldown = (
  state: GameState,
  cooldownTicks: number | null,
): GameState => ({
  ...state,
  weapons: state.weapons.map((weapon) => ({ ...weapon, cooldownTicks })),
});

describe("updateWeapons", (): void => {
  it("fires a ready weapon and restarts its cooldown", (): void => {
    const state = updateWeapons(withCooldown(createTestState(), READY), random);

    expect(state.bullets).toHaveLength(SINGLE);
    expect(state.weapons.at(NONE)?.cooldownTicks).toBe(WEAPONS.pistol.interval);
  });

  it("counts down a waiting weapon", (): void => {
    const state = updateWeapons(
      withCooldown(createTestState(), WAITING),
      random,
    );

    expect(state.bullets).toHaveLength(NONE);
    expect(state.weapons.at(NONE)?.cooldownTicks).toBe(WAITING - SINGLE);
  });

  it("rolls a random first delay", (): void => {
    const state = updateWeapons(createTestState(), random);

    expect(state.weapons.at(NONE)?.cooldownTicks).toBe(
      WEAPONS.pistol.interval * NEUTRAL_ROLL - SINGLE,
    );
  });
});

describe("updateWeapons with several weapons", (): void => {
  it("only restarts the weapon that fired", (): void => {
    const state = withCooldown(createTestState({ characterId: "anna" }), READY);
    const waiting = {
      ...state,
      weapons: state.weapons.map((weapon, index) =>
        index === NONE ? weapon : { ...weapon, cooldownTicks: WAITING },
      ),
    };
    const updated = updateWeapons(waiting, random);

    expect(updated.weapons.map((weapon) => weapon.cooldownTicks)).toEqual([
      computeFireInterval(state, {
        cooldownTicks: null,
        id: "sniper",
        level: SINGLE,
      }),
      WAITING - SINGLE,
    ]);
  });
});

describe("computeFireInterval", (): void => {
  it("speeds up Max Blitz with every level", (): void => {
    const blitz = createTestState({ characterId: "blitz" });
    const leveled = {
      ...blitz,
      progress: { ...blitz.progress, level: HIGH_LEVEL },
    };
    const [uzi] = blitz.weapons;

    if (uzi === undefined) {
      throw new Error("Blitz starts with an uzi");
    }

    expect(computeFireInterval(leveled, uzi)).toBe(
      BLITZ_LEVEL_TEN_INTERVAL - SINGLE,
    );
  });

  it("never fires faster than the minimum interval", (): void => {
    const state = createTestState();
    const fast = {
      ...state,
      stats: { ...state.stats, cooldownMultiplier: TINY_COOLDOWN },
    };
    const [pistol] = fast.weapons;

    expect(pistol && computeFireInterval(fast, pistol)).toBe(MINIMUM_INTERVAL);
  });
});
