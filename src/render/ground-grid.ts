import { listSteps } from "./paint";
import { NONE } from "../utils/numbers";
import type { Rect } from "../utils/collision";

/** A line segment in screen space. */
export type Segment = Readonly<{
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}>;

/** Screen coordinates of the grid lines crossing the view. */
export type GridLines = Readonly<{
  columns: ReadonlyArray<number>;
  rows: ReadonlyArray<number>;
}>;

/** Lists the screen positions of world grid lines (every `spacing` px) visible in the view. */
export const listGridLines = (view: Rect, spacing: number): GridLines => {
  const firstColumn = Math.floor(view.x / spacing) * spacing;
  const firstRow = Math.floor(view.y / spacing) * spacing;

  return {
    columns: listSteps(firstColumn, view.x + view.width + spacing, spacing).map(
      (column) => column - view.x,
    ),
    rows: listSteps(firstRow, view.y + view.height + spacing, spacing).map(
      (row) => row - view.y,
    ),
  };
};

/** Splits a horizontal line into dashes anchored to world coordinates. */
export const createHorizontalDashes = (
  line: Readonly<{ length: number; offset: number; y: number }>,
  pattern: Readonly<{ dash: number; gap: number }>,
): ReadonlyArray<Segment> => {
  const period = pattern.dash + pattern.gap;
  const start = -(line.offset % period);

  return listSteps(start, line.length, period)
    .map((fromX) => ({
      fromX: Math.max(NONE, fromX),
      fromY: line.y,
      toX: Math.min(line.length, fromX + pattern.dash),
      toY: line.y,
    }))
    .filter((segment) => segment.toX > segment.fromX);
};

/** Mirrors horizontal segments into vertical ones (x ↔ y). */
export const transposeSegments = (
  segments: ReadonlyArray<Segment>,
): ReadonlyArray<Segment> =>
  segments.map((segment) => ({
    fromX: segment.fromY,
    fromY: segment.fromX,
    toX: segment.toY,
    toY: segment.toX,
  }));
