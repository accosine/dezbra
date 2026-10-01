import type { Vector } from "./vector";

/** Axis-aligned rectangle. */
export type Rect = Readonly<{
  height: number;
  width: number;
  x: number;
  y: number;
}>;

/** A circle given by its center and radius. */
export type Circle = Readonly<{ radius: number; x: number; y: number }>;

type Penetration = Readonly<{
  bottom: number;
  left: number;
  right: number;
  top: number;
}>;

const isCircleOverlappingRect = (circle: Circle, rect: Rect): boolean =>
  circle.x + circle.radius > rect.x &&
  circle.x - circle.radius < rect.x + rect.width &&
  circle.y + circle.radius > rect.y &&
  circle.y - circle.radius < rect.y + rect.height;

const measurePenetration = (circle: Circle, rect: Rect): Penetration => ({
  bottom: rect.y + rect.height - (circle.y - circle.radius),
  left: circle.x + circle.radius - rect.x,
  right: rect.x + rect.width - (circle.x - circle.radius),
  top: circle.y + circle.radius - rect.y,
});

const resolvePenetration = (
  circle: Circle,
  penetration: Penetration,
): Circle => {
  const smallest = Math.min(
    penetration.left,
    penetration.right,
    penetration.top,
    penetration.bottom,
  );

  if (smallest === penetration.left) {
    return { ...circle, x: circle.x - penetration.left };
  }

  if (smallest === penetration.right) {
    return { ...circle, x: circle.x + penetration.right };
  }

  if (smallest === penetration.top) {
    return { ...circle, y: circle.y - penetration.top };
  }

  return { ...circle, y: circle.y + penetration.bottom };
};

/** Pushes a circle out of every overlapping rectangle along the shallowest axis. */
export const pushCircleOutOfRects = (
  circle: Circle,
  rects: ReadonlyArray<Rect>,
): Vector => {
  const resolved = rects.reduce<Circle>(
    (current, rect) =>
      isCircleOverlappingRect(current, rect)
        ? resolvePenetration(current, measurePenetration(current, rect))
        : current,
    circle,
  );

  return { x: resolved.x, y: resolved.y };
};

/** Returns true if the rectangle, grown by the margin, intersects the view. */
export const isRectInView = (rect: Rect, view: Rect, margin: number): boolean =>
  rect.x + rect.width > view.x - margin &&
  rect.x < view.x + view.width + margin &&
  rect.y + rect.height > view.y - margin &&
  rect.y < view.y + view.height + margin;

/** Returns true if the point lies within the view grown by the margin. */
export const isPointInView = (
  point: Vector,
  view: Rect,
  margin: number,
): boolean =>
  isRectInView({ height: 0, width: 0, x: point.x, y: point.y }, view, margin);
