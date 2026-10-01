/** A point or direction in 2D space. */
export type Vector = Readonly<{ x: number; y: number }>;

/** The origin, also used as "no movement". */
export const ZERO_VECTOR: Vector = Object.freeze({ x: 0, y: 0 });

const ZERO_LENGTH = 0;

/** Creates a vector of the given length pointing along the angle (radians). */
export const createVectorFromAngle = (
  angle: number,
  length: number,
): Vector => ({
  x: Math.cos(angle) * length,
  y: Math.sin(angle) * length,
});

/** Returns the Euclidean length of a vector. */
export const getVectorLength = (vector: Vector): number =>
  Math.hypot(vector.x, vector.y);

/** Scales a vector to length one; the zero vector stays unchanged. */
export const normalizeVector = (vector: Vector): Vector => {
  const length = getVectorLength(vector);

  if (length === ZERO_LENGTH) {
    return ZERO_VECTOR;
  }

  return { x: vector.x / length, y: vector.y / length };
};
