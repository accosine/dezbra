import { FULL_TURN } from "../utils/math";
import type { Vector } from "../utils/vector";

/** Center, radii and rotation (radians) of an ellipse. */
export type EllipseSpec = Readonly<{
  radiusX: number;
  radiusY: number;
  rotation: number;
  x: number;
  y: number;
}>;

const SEGMENTS = 24;

/** Returns the outline of a rotated ellipse as polygon points. */
export const createEllipsePoints = (
  ellipse: EllipseSpec,
): ReadonlyArray<Vector> => {
  const cosine = Math.cos(ellipse.rotation);
  const sine = Math.sin(ellipse.rotation);

  return Array.from({ length: SEGMENTS }, (_point, index): Vector => {
    const angle = (index / SEGMENTS) * FULL_TURN;
    const localX = Math.cos(angle) * ellipse.radiusX;
    const localY = Math.sin(angle) * ellipse.radiusY;

    return {
      x: ellipse.x + localX * cosine - localY * sine,
      y: ellipse.y + localX * sine + localY * cosine,
    };
  });
};
