import { NONE, STEP } from "../utils/numbers";
import { type Random, randomInteger } from "../utils/random";
import { fireWeapon } from "./weapon-fire";
import type { GameState } from "./game-state";
import { WEAPON_TUNING } from "./tuning";
import { WEAPONS } from "../data/weapons";
import type { WeaponSlot } from "./entities";

const computeBlitzBonus = (state: GameState): number =>
  state.character.id === "blitz"
    ? Math.min(
        WEAPON_TUNING.blitzMaxBonus,
        state.progress.level * WEAPON_TUNING.blitzBonusPerLevel,
      )
    : NONE;

/** Returns the fire interval of a weapon in ticks after all modifiers. */
export const computeFireInterval = (
  state: GameState,
  slot: WeaponSlot,
): number =>
  Math.max(
    WEAPON_TUNING.minimumInterval,
    Math.round(
      WEAPONS[slot.id].interval *
        state.stats.cooldownMultiplier *
        (STEP - computeBlitzBonus(state)),
    ),
  );

const tickWeapon = (
  state: GameState,
  slot: WeaponSlot,
  random: Random,
): GameState => {
  const interval = computeFireInterval(state, slot);
  const remaining =
    (slot.cooldownTicks ?? randomInteger(random, interval)) - STEP;
  const isFiring = remaining <= NONE;
  const updatedSlot = {
    ...slot,
    cooldownTicks: isFiring ? interval : remaining,
  };
  const withSlot = {
    ...state,
    weapons: state.weapons.map((weapon) =>
      weapon.id === slot.id ? updatedSlot : weapon,
    ),
  };

  return isFiring ? fireWeapon(withSlot, updatedSlot, random) : withSlot;
};

/** Counts down every weapon and fires those that are ready. */
export const updateWeapons = (state: GameState, random: Random): GameState =>
  state.weapons.reduce(
    (current, slot) => tickWeapon(current, slot, random),
    state,
  );
