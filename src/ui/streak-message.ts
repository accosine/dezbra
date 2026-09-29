/** Text and color of a combo streak announcement. */
export type StreakMessage = Readonly<{ color: string; text: string }>;

const NAMED_STREAKS: ReadonlyArray<Readonly<{ combo: number; text: string }>> =
  [
    { combo: 5, text: "🔥 5× COMBO!" },
    { combo: 10, text: "💥 10× COMBO!!" },
    { combo: 15, text: "⚡ 15× UNGLAUBLICH!" },
    { combo: 20, text: "☠️ 20× WAHNSINN!" },
    { combo: 30, text: "👑 30× LEGENDE!" },
    { combo: 50, text: "🌟 50× GOTT!" },
  ];

const STREAK_COLORS: ReadonlyArray<
  Readonly<{ color: string; minimum: number }>
> = [
  { color: "#ff0040", minimum: 20 },
  { color: "#ff4444", minimum: 10 },
  { color: "#f39c12", minimum: 5 },
];
const DEFAULT_STREAK_COLOR = "#f1c40f";

/** Returns the announcement for a combo milestone. */
export const getStreakMessage = (combo: number): StreakMessage => ({
  color:
    STREAK_COLORS.find((entry) => combo >= entry.minimum)?.color ??
    DEFAULT_STREAK_COLOR,
  text:
    NAMED_STREAKS.find((entry) => entry.combo === combo)?.text ??
    `🔥 ${combo}× COMBO!`,
});
