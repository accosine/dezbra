import type { DecorDefinition } from "./decor-shape";
import { deepFreeze } from "../utils/deep-freeze";

/** Dekoration des Vergessenen Friedhofs. */
export const CEMETERY_DECOR: Readonly<
  Record<"cross" | "crypt" | "grave" | "obelisk" | "tomb", DecorDefinition>
> = deepFreeze({
  cross: {
    shapes: [
      { color: "#2a2840", height: 32, kind: "rect", width: 6, x: -3, y: -22 },
      { color: "#2a2840", height: 6, kind: "rect", width: 20, x: -10, y: -15 },
      {
        alpha: 0.45,
        color: "#0c280c",
        height: 3,
        kind: "rect",
        width: 6,
        x: -3,
        y: 7,
      },
      {
        alpha: 0.3,
        color: "#282846",
        height: 28,
        kind: "rect",
        width: 4,
        x: -2,
        y: -20,
      },
    ],
    variantColors: [],
  },
  crypt: {
    shapes: [
      { color: "#1e1c34", height: 22, kind: "rect", width: 28, x: -14, y: -16 },
      { color: "#1e1c34", height: 5, kind: "rect", width: 28, x: -14, y: -20 },
      { color: "#10102a", height: 18, kind: "rect", width: 12, x: -6, y: -16 },
      {
        alpha: 0.3,
        color: "#500000",
        height: 10,
        kind: "rect",
        width: 8,
        x: -4,
        y: -12,
      },
      {
        alpha: 0.5,
        color: "#0c280c",
        height: 2,
        kind: "rect",
        width: 28,
        x: -14,
        y: 4,
      },
    ],
    variantColors: [],
  },
  grave: {
    shapes: [
      { color: "#2a2838", height: 6, kind: "rect", width: 12, x: -6, y: -18 },
      { color: "#2a2838", height: 18, kind: "rect", width: 10, x: -5, y: -12 },
      { color: "#1e1c2e", height: 4, kind: "rect", width: 8, x: -3, y: -17 },
      {
        alpha: 0.6,
        color: "#0c280c",
        height: 4,
        kind: "rect",
        width: 10,
        x: -5,
        y: 2,
      },
      {
        alpha: 0.4,
        color: "#28283c",
        height: 8,
        kind: "rect",
        width: 8,
        x: -4,
        y: -10,
      },
    ],
    variantColors: [],
  },
  obelisk: {
    shapes: [
      { color: "#1e1c30", height: 30, kind: "rect", width: 10, x: -5, y: -28 },
      { color: "#1e1c30", height: 4, kind: "rect", width: 6, x: -3, y: -32 },
      { color: "#1e1c30", height: 2, kind: "rect", width: 2, x: -1, y: -34 },
      {
        alpha: 0.04,
        color: "#ffffff",
        height: 28,
        kind: "rect",
        width: 5,
        x: -4,
        y: -28,
      },
    ],
    variantColors: [],
  },
  tomb: {
    shapes: [
      { color: "#242238", height: 14, kind: "rect", width: 24, x: -12, y: -8 },
      { color: "#242238", height: 5, kind: "rect", width: 24, x: -12, y: -12 },
      { color: "#181628", height: 9, kind: "rect", width: 14, x: -7, y: -8 },
      {
        alpha: 0.5,
        color: "#282846",
        height: 6,
        kind: "rect",
        width: 10,
        x: -5,
        y: -6,
      },
    ],
    variantColors: [],
  },
});
