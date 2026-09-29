/** Lifetime statistics that can unlock characters and maps. */
export type ProgressStatistic =
  "bestScore" | "bossKills" | "fusionsBuilt" | "runsPlayed" | "totalKills";

/** Unlocked once the statistic reaches the threshold; `hint` explains it while locked. */
export type UnlockRequirement = Readonly<{
  hint: string;
  statistic: ProgressStatistic;
  threshold: number;
}>;

/** Snapshot of all lifetime statistics. */
export type ProgressStatistics = Readonly<Record<ProgressStatistic, number>>;

/** Returns true if the statistics satisfy the requirement. */
export const isRequirementMet = (
  requirement: UnlockRequirement,
  statistics: ProgressStatistics,
): boolean => statistics[requirement.statistic] >= requirement.threshold;
