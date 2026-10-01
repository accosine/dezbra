import { isFusionWeapon, WEAPONS } from "../data/weapons";
import type { GameState } from "./game-state";
import { getElapsedSeconds } from "./step";

const FUSION_MARK = "✨";
const WEAPON_SEPARATOR = "  ";

/** Everything the game-over screen and the save need from a finished run. */
export type RunSummary = Readonly<{
  bestCombo: number;
  coins: number;
  kills: number;
  score: number;
  seconds: number;
  weaponIcons: string;
}>;

/** Summarizes a run for the game-over screen and the lifetime progress. */
export const summarizeRun = (state: GameState): RunSummary => ({
  bestCombo: state.progress.bestCombo,
  coins: state.progress.earnedCoins,
  kills: state.progress.kills,
  score: state.progress.score,
  seconds: getElapsedSeconds(state),
  weaponIcons: state.weapons
    .map((slot) => {
      const weapon = WEAPONS[slot.id];

      return `${weapon.icon}${isFusionWeapon(weapon) ? FUSION_MARK : ""}`;
    })
    .join(WEAPON_SEPARATOR),
});
