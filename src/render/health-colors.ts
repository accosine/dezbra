/** Health ratio thresholds and colors of an enemy health bar. */
const ENEMY_BAR = { high: 0.6, low: 0.3 };
const BOSS_BAR = { high: 0.5, low: 0.25 };
const COLORS = { healthy: "#27ae60", hurt: "#e67e22" };

/** Color of a regular enemy's health bar. */
export const pickEnemyHealthColor = (ratio: number): string => {
  if (ratio > ENEMY_BAR.high) {
    return COLORS.healthy;
  }

  return ratio > ENEMY_BAR.low ? COLORS.hurt : "#c0392b";
};

/** Color of a boss health bar above the boss. */
export const pickBossHealthColor = (ratio: number): string => {
  if (ratio > BOSS_BAR.high) {
    return COLORS.healthy;
  }

  return ratio > BOSS_BAR.low ? COLORS.hurt : "#e74c3c";
};

const PLAYER_BAR = { high: 0.55, low: 0.28 };

/** Color of the player's health bar in the HUD. */
export const pickPlayerHealthColor = (ratio: number): string => {
  if (ratio > PLAYER_BAR.high) {
    return COLORS.healthy;
  }

  return ratio > PLAYER_BAR.low ? COLORS.hurt : "#c0392b";
};

const THRESHOLD_COLORS = {
  combo: [
    { color: "#ff0000", minimum: 20 },
    { color: "#ff4444", minimum: 10 },
    { color: "#f39c12", minimum: 5 },
  ],
  wave: [
    { color: "#f39c12", minimum: 0.8 },
    { color: "#f1c40f", minimum: 0.5 },
  ],
};

/** Color of the combo counter. */
export const pickComboColor = (combo: number): string =>
  THRESHOLD_COLORS.combo.find((entry) => combo >= entry.minimum)?.color ??
  "#f1c40f";

/** Color of the wave timer bar as the wave nears its end. */
export const pickWaveColor = (progress: number): string =>
  THRESHOLD_COLORS.wave.find((entry) => progress > entry.minimum)?.color ??
  "#2ecc71";
