import {
  andThen,
  createBanner,
  type StepContext,
  type StepResult,
  withEvents,
} from "./step-result";
import { computeMaxEnemies } from "./enemies";
import { findBossForWave } from "../data/bosses";
import type { GameState } from "./game-state";
import { STEP } from "../utils/numbers";
import { trySpawnBoss } from "./boss";
import { WAVE_TUNING } from "./tuning";

const BOSS_WAVE_COLOR = "#ff4444";
const WAVE_COLOR = "#2ecc71";

const announceWave = (wave: number): ReturnType<typeof createBanner> =>
  findBossForWave(wave) === undefined
    ? createBanner(
        `WELLE ${wave}  (${computeMaxEnemies(wave)} FEINDE)`,
        WAVE_COLOR,
      )
    : createBanner(`⚠️ WELLE ${wave} — BOSS KOMMT!`, BOSS_WAVE_COLOR);

/** Counts down the wave timer; a new wave heals the player and may bring a boss. */
export const updateWave = (
  state: GameState,
  context: StepContext,
): StepResult => {
  const waveTicks = state.progress.waveTicks + STEP;

  if (waveTicks < WAVE_TUNING.waveTicks) {
    return withEvents(
      { ...state, progress: { ...state.progress, waveTicks } },
      [],
    );
  }

  const wave = state.progress.wave + STEP;
  const heal = WAVE_TUNING.baseHeal + state.map.healBonus;
  const next: GameState = {
    ...state,
    progress: { ...state.progress, wave, waveTicks: 0 },
    stats: {
      ...state.stats,
      health: Math.min(state.stats.maxHealth, state.stats.health + heal),
    },
  };

  return andThen(withEvents(next, [announceWave(wave)]), (current) =>
    trySpawnBoss(current, context.random),
  );
};
