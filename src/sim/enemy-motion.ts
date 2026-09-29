import { NONE, STEP } from "../utils/numbers";
import type { Enemy } from "./entities";
import type { GameState } from "./game-state";
import { pushCircleOutOfRects } from "../utils/collision";

/** Moves an enemy along an angle (radians) by the given distance. */
export const moveEnemyAlong = <Moving extends Enemy>(
  enemy: Moving,
  angle: number,
  distance: number,
): Moving => ({
  ...enemy,
  x: enemy.x + Math.cos(angle) * distance,
  y: enemy.y + Math.sin(angle) * distance,
});

/** Advances the walk animation; the frame flips after `frameTicks`. */
export const animateEnemyWalk = <Walker extends Enemy>(
  enemy: Walker,
  frameTicks: number,
): Walker => {
  const walkTicks = enemy.walkTicks + STEP;

  return walkTicks > frameTicks
    ? { ...enemy, walkFrame: STEP - enemy.walkFrame, walkTicks: NONE }
    : { ...enemy, walkTicks };
};

/** Pushes an enemy out of buildings. */
export const collideEnemyWithBuildings = (
  state: GameState,
  enemy: Enemy,
): Enemy => {
  const position = pushCircleOutOfRects(
    { radius: enemy.radius, x: enemy.x, y: enemy.y },
    state.world.buildings,
  );

  return { ...enemy, x: position.x, y: position.y };
};

/** Returns true if the enemy touches the vulnerable player (with extra padding). */
export const isTouchingPlayer = (
  state: GameState,
  enemy: Enemy,
  padding: number,
): boolean =>
  state.player.invulnerableTicks <= NONE &&
  Math.hypot(enemy.x - state.player.x, enemy.y - state.player.y) <
    state.player.radius + enemy.radius + padding;

/** Replaces an enemy (matched by id) in the state. */
export const replaceEnemy = (state: GameState, enemy: Enemy): GameState => ({
  ...state,
  enemies: state.enemies.map((candidate) =>
    candidate.id === enemy.id ? enemy : candidate,
  ),
});
