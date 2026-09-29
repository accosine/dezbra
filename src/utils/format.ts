const SECONDS_PER_MINUTE = 60;
const SECOND_DIGITS = 2;

/** Formats seconds as "m:ss". */
export const formatClock = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
  const seconds = Math.floor(totalSeconds % SECONDS_PER_MINUTE);

  return `${minutes}:${String(seconds).padStart(SECOND_DIGITS, "0")}`;
};

/** Formats a score with German thousands separators. */
export const formatScore = (score: number): string =>
  Math.floor(score).toLocaleString("de-DE");
