import { combineMovementInput, movePlayer } from "./player-movement";
import { describe, expect, it } from "vitest";
import type { Building } from "./world";
import { createTestState } from "./sim-fixtures";
import type { GameState } from "./game-state";
import { PLAYER_TUNING } from "./tuning";
import type { Vector } from "../utils/vector";

const NO_KEYS = { down: false, left: false, right: false, up: false };
const DIRECTION = {
  diagonal: { x: 1, y: 1 },
  halfRight: { x: 0.5, y: 0 },
  left: { x: -1, y: 0 },
  still: { x: 0, y: 0 },
  upLeft: { x: -1, y: -1 },
};
const FACING_LEFT = -1;
const WALL = { gap: 5, size: 100 };
const CORNER = { x: 1, y: 1 };

const moveTimes = (
  state: GameState,
  movement: Vector,
  times: number,
): GameState =>
  Array.from({ length: times }).reduce<GameState>(
    (current) => movePlayer(current, movement),
    state,
  );

const createWallLeftOfPlayer = (state: GameState): Building => ({
  height: WALL.size,
  isDamaged: false,
  paletteIndex: 0,
  width: WALL.size,
  windowColumns: 1,
  windowRows: 1,
  windows: [],
  x: state.player.x - PLAYER_TUNING.radius - WALL.gap - WALL.size,
  y: state.player.y - WALL.gap,
});

describe("combineMovementInput", (): void => {
  it("uses the joystick when no key is held", (): void => {
    expect(combineMovementInput(DIRECTION.halfRight, NO_KEYS)).toEqual(
      DIRECTION.halfRight,
    );
  });

  it("lets held keys override the joystick per axis", (): void => {
    expect(
      combineMovementInput(DIRECTION.halfRight, {
        ...NO_KEYS,
        left: true,
        up: true,
      }),
    ).toEqual(DIRECTION.upLeft);
    expect(
      combineMovementInput(DIRECTION.still, {
        ...NO_KEYS,
        down: true,
        right: true,
      }),
    ).toEqual(DIRECTION.diagonal);
  });
});

describe("movePlayer direction", (): void => {
  it("moves at full speed in any direction and faces the movement", (): void => {
    const state = createTestState();
    const moved = movePlayer(state, DIRECTION.diagonal);

    expect(
      Math.hypot(
        moved.player.x - state.player.x,
        moved.player.y - state.player.y,
      ),
    ).toBeCloseTo(state.stats.speed);
    expect(movePlayer(state, DIRECTION.left).player.facing).toBe(FACING_LEFT);
    expect(movePlayer(state, DIRECTION.still).player).toEqual(state.player);
  });

  it("animates the walk cycle while moving", (): void => {
    const walked = moveTimes(
      createTestState(),
      DIRECTION.left,
      PLAYER_TUNING.walkFrameTicks + CORNER.x,
    );

    expect(walked.player).toMatchObject({ walkFrame: 1, walkTicks: 0 });
  });
});

describe("movePlayer collisions", (): void => {
  it("stays inside the world", (): void => {
    const state = createTestState();
    const cornered = { ...state, player: { ...state.player, ...CORNER } };

    expect(movePlayer(cornered, DIRECTION.still).player).toMatchObject({
      x: PLAYER_TUNING.radius,
      y: PLAYER_TUNING.radius,
    });
  });

  it("stops at buildings", (): void => {
    const state = createTestState();
    const walled = {
      ...state,
      world: { ...state.world, buildings: [createWallLeftOfPlayer(state)] },
    };

    expect(moveTimes(walled, DIRECTION.left, WALL.gap).player.x).toBeCloseTo(
      state.player.x - WALL.gap,
    );
  });
});
