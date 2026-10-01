import { type DecorDefinition, VARIANT_COLOR } from "./decor-shape";
import { deepFreeze } from "../utils/deep-freeze";

/** Dekoration, die auf mehreren Karten vorkommt. */
export const COMMON_DECOR: Readonly<
  Record<"barrel" | "crate", DecorDefinition>
> = deepFreeze({
  barrel: {
    shapes: [
      {
        color: VARIANT_COLOR,
        height: 18,
        kind: "rect",
        width: 10,
        x: -5,
        y: -9,
      },
      {
        alpha: 0.3,
        color: "#b4b4b4",
        height: 2,
        kind: "rect",
        width: 10,
        x: -5,
        y: -9,
      },
      {
        alpha: 0.3,
        color: "#b4b4b4",
        height: 2,
        kind: "rect",
        width: 10,
        x: -5,
        y: 7,
      },
      {
        alpha: 0.3,
        color: "#b4b4b4",
        height: 2,
        kind: "rect",
        width: 10,
        x: -5,
        y: -1,
      },
      {
        alpha: 0.35,
        color: "#000000",
        height: 18,
        kind: "rect",
        width: 2,
        x: 3,
        y: -9,
      },
    ],
    variantColors: ["#3e2818", "#1c2a1a"],
  },
  crate: {
    shapes: [
      { color: "#4c3212", height: 18, kind: "rect", width: 18, x: -9, y: -9 },
      { color: "#6c4a18", height: 3, kind: "rect", width: 18, x: -9, y: -9 },
      { color: "#6c4a18", height: 18, kind: "rect", width: 3, x: -9, y: -9 },
      {
        alpha: 0.3,
        color: "#000000",
        height: 18,
        kind: "rect",
        width: 3,
        x: 6,
        y: -9,
      },
      {
        alpha: 0.3,
        color: "#000000",
        height: 3,
        kind: "rect",
        width: 18,
        x: -9,
        y: 6,
      },
      {
        alpha: 0.1,
        color: "#ffc864",
        height: 14,
        kind: "rect",
        width: 14,
        x: -7,
        y: -7,
      },
    ],
    variantColors: [],
  },
});
