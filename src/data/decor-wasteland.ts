import { type DecorDefinition, VARIANT_COLOR } from "./decor-shape";
import { deepFreeze } from "../utils/deep-freeze";

/** Dekoration des Ödlands. */
export const WASTELAND_DECOR: Readonly<
  Record<"cactus" | "rock" | "sandDune" | "skull" | "wreck", DecorDefinition>
> = deepFreeze({
  cactus: {
    shapes: [
      { color: "#2a5218", height: 26, kind: "rect", width: 8, x: -4, y: -24 },
      { color: "#2a5218", height: 4, kind: "rect", width: 9, x: -12, y: -10 },
      { color: "#2a5218", height: 9, kind: "rect", width: 4, x: -16, y: -14 },
      { color: "#2a5218", height: 4, kind: "rect", width: 9, x: 5, y: -8 },
      { color: "#2a5218", height: 9, kind: "rect", width: 4, x: 11, y: -12 },
      {
        alpha: 0.3,
        color: "#3c781e",
        height: 20,
        kind: "rect",
        width: 5,
        x: -3,
        y: -22,
      },
    ],
    variantColors: [],
  },
  rock: {
    shapes: [
      {
        color: "#2c2218",
        kind: "ellipse",
        radiusX: 14,
        radiusY: 9,
        rotation: 0,
        x: 0,
        y: 0,
      },
      {
        color: "#3c3228",
        kind: "ellipse",
        radiusX: 9,
        radiusY: 6,
        rotation: -0.3,
        x: -3,
        y: -3,
      },
      {
        alpha: 0.2,
        color: "#000000",
        kind: "ellipse",
        radiusX: 14,
        radiusY: 9,
        rotation: 0,
        x: 0,
        y: 0,
      },
    ],
    variantColors: [],
  },
  sandDune: {
    shapes: [
      {
        alpha: 0.6,
        color: "#140e04",
        kind: "ellipse",
        radiusX: 22,
        radiusY: 8,
        rotation: 0,
        x: 0,
        y: 0,
      },
      {
        alpha: 0.4,
        color: "#1e1406",
        kind: "ellipse",
        radiusX: 14,
        radiusY: 5,
        rotation: -0.2,
        x: -4,
        y: -3,
      },
    ],
    variantColors: [],
  },
  skull: {
    shapes: [
      { color: "#ccc8a8", height: 12, kind: "rect", width: 14, x: -7, y: -10 },
      { color: "#ccc8a8", height: 5, kind: "rect", width: 10, x: -5, y: -14 },
      { color: "#0a0808", height: 4, kind: "rect", width: 4, x: -4, y: -12 },
      { color: "#0a0808", height: 4, kind: "rect", width: 4, x: 1, y: -12 },
      { color: "#0a0808", height: 2, kind: "rect", width: 4, x: -4, y: -2 },
      { color: "#0a0808", height: 2, kind: "rect", width: 4, x: 0, y: -2 },
      { color: "#0a0808", height: 2, kind: "rect", width: 4, x: -4, y: 0 },
      { color: "#0a0808", height: 2, kind: "rect", width: 4, x: 0, y: 0 },
    ],
    variantColors: [],
  },
  wreck: {
    shapes: [
      {
        color: VARIANT_COLOR,
        height: 14,
        kind: "rect",
        width: 40,
        x: -20,
        y: -7,
      },
      {
        alpha: 0.45,
        color: "#000000",
        height: 4,
        kind: "rect",
        width: 40,
        x: -20,
        y: -7,
      },
      {
        alpha: 0.45,
        color: "#5a2300",
        height: 9,
        kind: "rect",
        width: 18,
        x: -8,
        y: -2,
      },
      { color: "#080604", height: 7, kind: "rect", width: 9, x: -14, y: -6 },
      {
        alpha: 0.3,
        color: "#000000",
        height: 14,
        kind: "rect",
        width: 8,
        x: 12,
        y: -7,
      },
    ],
    variantColors: ["#3e2212", "#2c1808", "#4e2a18"],
  },
});
