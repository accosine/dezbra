import { getVectorLength, type Vector, ZERO_VECTOR } from "./vector";

const RESTING_LENGTH = 0;

/** Normalized movement direction plus the clamped knob offset in pixels. */
export type JoystickReading = Readonly<{ knob: Vector; movement: Vector }>;

/** Converts a pointer offset from the joystick center into movement and knob position. */
export const readJoystick = (
  offset: Vector,
  radius: number,
): JoystickReading => {
  const length = getVectorLength(offset);

  if (length === RESTING_LENGTH) {
    return { knob: ZERO_VECTOR, movement: ZERO_VECTOR };
  }

  const clampedLength = Math.min(length, radius);
  const direction = { x: offset.x / length, y: offset.y / length };

  return {
    knob: { x: direction.x * clampedLength, y: direction.y * clampedLength },
    movement: {
      x: (direction.x * clampedLength) / radius,
      y: (direction.y * clampedLength) / radius,
    },
  };
};
