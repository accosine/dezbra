import type { DecorShape } from "../data/decor-shape";
import { deepFreeze } from "../utils/deep-freeze";

/** An experience crystal (from the original drawGems). */
export const GEM_SHAPES: ReadonlyArray<DecorShape> = deepFreeze([
  { color: "#8e44ad", height: 6, kind: "rect", width: 6, x: -3, y: -3 },
  { color: "#c39bd3", height: 2, kind: "rect", width: 2, x: -1, y: -4 },
  {
    alpha: 0.3,
    color: "#c896f0",
    height: 2,
    kind: "rect",
    width: 10,
    x: -4,
    y: 0,
  },
]);

/** A boss chest body with lid, bands and lock (from the original drawChests). */
export const CHEST_SHAPES: ReadonlyArray<DecorShape> = deepFreeze([
  { color: "#5c3c12", height: 22, kind: "rect", width: 30, x: -15, y: -11 },
  { color: "#7c5420", height: 10, kind: "rect", width: 30, x: -15, y: -11 },
  { color: "#c8a020", height: 3, kind: "rect", width: 30, x: -15, y: -2 },
  { color: "#c8a020", height: 22, kind: "rect", width: 4, x: -2, y: -11 },
  { color: "#ffd700", kind: "circle", radius: 4.5, x: 0, y: 0 },
  { color: "#b8940a", kind: "circle", radius: 2, x: 0, y: 0 },
]);
