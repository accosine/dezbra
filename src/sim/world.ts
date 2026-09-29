import type { DecorType } from "../data/decor-shapes";
import type { Rect } from "../utils/collision";

/** A window of a building. */
export type BuildingWindow = Readonly<{
  column: number;
  isBroken: boolean;
  isLit: boolean;
  row: number;
}>;

/** A solid building; blocks movement. */
export type Building = Rect &
  Readonly<{
    isDamaged: boolean;
    paletteIndex: number;
    windowColumns: number;
    windowRows: number;
    windows: ReadonlyArray<BuildingWindow>;
  }>;

/** A decorative object; `rotation` in degrees (multiples of 90). */
export type Decoration = Readonly<{
  rotation: number;
  type: DecorType;
  variant: number;
  x: number;
  y: number;
}>;

/** A ground stain (blood, oil …) drawn as an ellipse. */
export type Stain = Readonly<{
  alpha: number;
  radiusX: number;
  radiusY: number;
  x: number;
  y: number;
}>;

/** The static part of a map. */
export type World = Readonly<{
  buildings: ReadonlyArray<Building>;
  decorations: ReadonlyArray<Decoration>;
  stains: ReadonlyArray<Stain>;
}>;
