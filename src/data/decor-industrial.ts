import type { DecorDefinition } from "./decor-shape";
import { deepFreeze } from "../utils/deep-freeze";

/** Dekoration des Industriegebiets. */
export const INDUSTRIAL_DECOR: Readonly<
  Record<"craneArm" | "drum" | "pipe" | "tank" | "vent", DecorDefinition>
> = deepFreeze({
  craneArm: {
    shapes: [
      { color: "#282410", height: 30, kind: "rect", width: 4, x: -2, y: -30 },
      { color: "#282410", height: 4, kind: "rect", width: 22, x: -2, y: -30 },
      { color: "#282410", height: 15, kind: "rect", width: 4, x: 18, y: -30 },
    ],
    variantColors: [],
  },
  drum: {
    shapes: [
      { color: "#1a1814", height: 20, kind: "rect", width: 12, x: -6, y: -10 },
      { color: "#1a1814", height: 4, kind: "rect", width: 16, x: -8, y: -10 },
      {
        alpha: 0.3,
        color: "#645000",
        height: 12,
        kind: "rect",
        width: 10,
        x: -5,
        y: -6,
      },
      {
        alpha: 0.2,
        color: "#c8c8c8",
        height: 2,
        kind: "rect",
        width: 12,
        x: -6,
        y: -10,
      },
    ],
    variantColors: [],
  },
  pipe: {
    shapes: [
      { color: "#3a3028", height: 10, kind: "rect", width: 40, x: -20, y: -5 },
      { color: "#4c4038", height: 4, kind: "rect", width: 40, x: -20, y: -5 },
      {
        alpha: 0.35,
        color: "#000000",
        height: 10,
        kind: "rect",
        width: 6,
        x: 14,
        y: -5,
      },
      { color: "#2a2020", height: 10, kind: "rect", width: 6, x: -20, y: -5 },
      { color: "#2a2020", height: 10, kind: "rect", width: 6, x: 14, y: -5 },
    ],
    variantColors: [],
  },
  tank: {
    shapes: [
      { color: "#2a2818", height: 18, kind: "rect", width: 28, x: -14, y: -9 },
      { color: "#2a2818", height: 5, kind: "rect", width: 18, x: -9, y: -13 },
      { color: "#3a3820", height: 4, kind: "rect", width: 28, x: -14, y: -9 },
      {
        alpha: 0.35,
        color: "#000000",
        height: 18,
        kind: "rect",
        width: 4,
        x: 10,
        y: -9,
      },
      {
        alpha: 0.3,
        color: "#503c00",
        height: 8,
        kind: "rect",
        width: 5,
        x: -8,
        y: -5,
      },
    ],
    variantColors: [],
  },
  vent: {
    shapes: [
      { color: "#2c2a20", height: 18, kind: "rect", width: 18, x: -9, y: -9 },
      { color: "#3c3828", height: 4, kind: "rect", width: 18, x: -9, y: -9 },
      {
        alpha: 0.5,
        color: "#000000",
        height: 10,
        kind: "rect",
        width: 1,
        x: -7,
        y: -5,
      },
      {
        alpha: 0.5,
        color: "#000000",
        height: 10,
        kind: "rect",
        width: 1,
        x: -4,
        y: -5,
      },
      {
        alpha: 0.5,
        color: "#000000",
        height: 10,
        kind: "rect",
        width: 1,
        x: -1,
        y: -5,
      },
      {
        alpha: 0.5,
        color: "#000000",
        height: 10,
        kind: "rect",
        width: 1,
        x: 2,
        y: -5,
      },
      {
        alpha: 0.5,
        color: "#000000",
        height: 10,
        kind: "rect",
        width: 1,
        x: 5,
        y: -5,
      },
      {
        alpha: 0.08,
        color: "#ffc800",
        height: 14,
        kind: "rect",
        width: 16,
        x: -8,
        y: -8,
      },
    ],
    variantColors: [],
  },
});
