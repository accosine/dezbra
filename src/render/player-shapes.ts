import { type DecorShape, VARIANT_COLOR } from "../data/decor-shape";
import { deepFreeze } from "../utils/deep-freeze";

/** The gun in the player's hand; the variant color is the first weapon's color. */
export const GUN_SHAPES: ReadonlyArray<DecorShape> = deepFreeze([
  { color: VARIANT_COLOR, height: 3, kind: "rect", width: 14, x: 0, y: 0 },
  { color: "#444444", height: 2, kind: "rect", width: 10, x: 0, y: 3 },
  {
    alpha: 0.3,
    color: "#ffffff",
    height: 1,
    kind: "rect",
    width: 12,
    x: 1,
    y: 0,
  },
  {
    alpha: 0.27,
    color: VARIANT_COLOR,
    height: 3,
    kind: "rect",
    width: 5,
    x: 12,
    y: -2,
  },
]);
