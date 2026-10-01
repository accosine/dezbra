import { getVectorLength, normalizeVector, type Vector } from "../utils/vector";
import { NONE, STEP } from "../utils/numbers";
import { clamp } from "../utils/math";
import type { GameState } from "./game-state";
import type { Player } from "./entities";
import { PLAYER_TUNING } from "./tuning";
import { pushCircleOutOfRects } from "../utils/collision";

const FACING_LEFT = -1;
const FACING_RIGHT = 1;

/** Movement keys that are currently held. */
export type HeldKeys = Readonly<{
  down: boolean;
  left: boolean;
  right: boolean;
  up: boolean;
}>;

const pickAxis = (
  joystickValue: number,
  negative: boolean,
  positive: boolean,
): number => {
  if (positive) {
    return FACING_RIGHT;
  }

  return negative ? FACING_LEFT : joystickValue;
};

/** Combines joystick and keyboard; held keys override the joystick per axis. */
export const combineMovementInput = (
  joystick: Vector,
  keys: HeldKeys,
): Vector => ({
  x: pickAxis(joystick.x, keys.left, keys.right),
  y: pickAxis(joystick.y, keys.up, keys.down),
});

const animateWalk = (player: Player, inputLength: number): Player => {
  if (inputLength <= PLAYER_TUNING.walkThreshold) {
    return player;
  }

  const walkTicks = player.walkTicks + STEP;

  return walkTicks > PLAYER_TUNING.walkFrameTicks
    ? { ...player, walkFrame: STEP - player.walkFrame, walkTicks: NONE }
    : { ...player, walkTicks };
};

const faceDirection = (player: Player, direction: Vector): Player => {
  if (direction.x === NONE) {
    return player;
  }

  return { ...player, facing: direction.x > NONE ? FACING_RIGHT : FACING_LEFT };
};

/** Moves the player (normalized input), resolves building collisions and world bounds. */
export const movePlayer = (state: GameState, movement: Vector): GameState => {
  const direction = normalizeVector(movement);
  const { player } = state;
  const moved = pushCircleOutOfRects(
    {
      radius: player.radius,
      x: player.x + direction.x * state.stats.speed,
      y: player.y + direction.y * state.stats.speed,
    },
    state.world.buildings,
  );
  const limit = state.map.worldSize - player.radius;
  const animated = animateWalk(
    faceDirection(player, direction),
    getVectorLength(movement),
  );

  return {
    ...state,
    player: {
      ...animated,
      x: clamp(moved.x, player.radius, limit),
      y: clamp(moved.y, player.radius, limit),
    },
  };
};
