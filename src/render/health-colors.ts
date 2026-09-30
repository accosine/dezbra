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
