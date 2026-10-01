import type { DecorShape } from "../data/decor-shape";
import { deepFreeze } from "../utils/deep-freeze";

/** The crown of big zombies, relative to the top center of the sprite. */
export const CROWN_SHAPES: ReadonlyArray<DecorShape> = deepFreeze([
  { color: "#d4ac0d", height: 6, kind: "rect", width: 4, x: -9, y: -5 },
  { color: "#d4ac0d", height: 9, kind: "rect", width: 5, x: -3, y: -9 },
  { color: "#d4ac0d", height: 6, kind: "rect", width: 4, x: 5, y: -5 },
  { color: "#c0392b", height: 5, kind: "rect", width: 3, x: -8, y: -10 },
  { color: "#c0392b", height: 4, kind: "rect", width: 5, x: -1, y: -13 },
  { color: "#c0392b", height: 5, kind: "rect", width: 3, x: 8, y: -10 },
]);
