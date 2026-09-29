import { type DecorDefinition, VARIANT_COLOR } from "./decor-shape";
import { deepFreeze } from "../utils/deep-freeze";

/** Dekoration der Verlassenen Stadt. */
export const CITY_DECOR: Readonly<
  Record<"car" | "fireHydrant" | "lamp", DecorDefinition>
> = deepFreeze({
  car: {
    shapes: [
      {
        color: VARIANT_COLOR,
        height: 14,
        kind: "rect",
        width: 34,
        x: -17,
        y: -7,
      },
      { color: "#0a1428", height: 10, kind: "rect", width: 13, x: -9, y: -5 },
      {
        alpha: 0.15,
        color: "#648cc8",
        height: 9,
        kind: "rect",
        width: 11,
        x: -8,
        y: -4,
      },
      { color: "#0e0e0e", height: 5, kind: "rect", width: 5, x: -16, y: -6 },
      { color: "#0e0e0e", height: 5, kind: "rect", width: 5, x: 11, y: -6 },
      { color: "#0e0e0e", height: 5, kind: "rect", width: 5, x: -16, y: 3 },
      { color: "#0e0e0e", height: 5, kind: "rect", width: 5, x: 11, y: 3 },
      {
        alpha: 0.4,
        color: "#501e00",
        height: 3,
        kind: "rect",
        width: 7,
        x: -3,
        y: 4,
      },
      {
        alpha: 0.1,
        color: "#ffffff",
        height: 5,
        kind: "rect",
        width: 3,
        x: 3,
        y: -6,
      },
    ],
    variantColors: [
      "#1a2a4e",
      "#3e1414",
      "#1a3e1a",
      "#262226",
      "#3e2a0a",
      "#1a1a2e",
    ],
  },
  fireHydrant: {
    shapes: [
      { color: "#8b0000", height: 12, kind: "rect", width: 8, x: -4, y: -12 },
      { color: "#8b0000", height: 4, kind: "rect", width: 12, x: -6, y: -14 },
      { color: "#8b0000", height: 6, kind: "rect", width: 6, x: -3, y: -6 },
      {
        alpha: 0.5,
        color: "#b40000",
        height: 3,
        kind: "rect",
        width: 6,
        x: -3,
        y: -12,
      },
    ],
    variantColors: [],
  },
  lamp: {
    shapes: [
      { color: "#2a2a2a", height: 26, kind: "rect", width: 4, x: -2, y: -26 },
      { color: "#2a2a2a", height: 4, kind: "rect", width: 14, x: -7, y: -26 },
      {
        alpha: 0.92,
        color: "#ffd700",
        kind: "circle",
        radius: 5,
        x: 0,
        y: -26,
      },
      {
        alpha: 0.12,
        color: "#ffffee",
        kind: "circle",
        radius: 20,
        x: 0,
        y: -26,
      },
      {
        alpha: 0.04,
        color: "#ffffee",
        kind: "circle",
        radius: 35,
        x: 0,
        y: -26,
      },
    ],
    variantColors: [],
  },
});
