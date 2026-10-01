/** Placeholder color that is replaced by the chosen variant color. */
export const VARIANT_COLOR = "variant";

type ShapePaint = Readonly<{ alpha?: number; color: string }>;

/** Axis-aligned rectangle relative to the decor center. */
export type RectShape = ShapePaint &
  Readonly<{
    height: number;
    kind: "rect";
    width: number;
    x: number;
    y: number;
  }>;

/** Circle relative to the decor center. */
export type CircleShape = ShapePaint &
  Readonly<{ kind: "circle"; radius: number; x: number; y: number }>;

/** Rotated ellipse relative to the decor center; rotation in radians. */
export type EllipseShape = ShapePaint &
  Readonly<{
    kind: "ellipse";
    radiusX: number;
    radiusY: number;
    rotation: number;
    x: number;
    y: number;
  }>;

/** One drawing primitive of a decoration. */
export type DecorShape = CircleShape | EllipseShape | RectShape;

/** A decoration drawn from primitives; `variantColors` replace {@link VARIANT_COLOR}. */
export type DecorDefinition = Readonly<{
  shapes: ReadonlyArray<DecorShape>;
  variantColors: ReadonlyArray<string>;
}>;
