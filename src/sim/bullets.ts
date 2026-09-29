import {
  andThen,
  type StepContext,
  type StepResult,
  withoutEvents,
} from "./step-result";
import type { Bullet, Player } from "./entities";
import {
  explode,
  type Explosion,
  findBulletTarget,
  hitEnemy,
  rememberHit,
  survivesHit,
} from "./combat";
import { HALF, NONE, STEP } from "../utils/numbers";
import { COMBAT_TUNING } from "./tuning";
import { damagePlayer } from "./player-damage";
import { distanceBetween } from "../utils/math";
import type { GameState } from "./game-state";
import type { Random } from "../utils/random";

type BulletPass = Readonly<{
  result: StepResult;
  survivors: ReadonlyArray<Bullet>;
}>;

const moveStraight = (bullet: Bullet): Bullet => ({
  ...bullet,
  life: bullet.life - STEP,
  x: bullet.x + bullet.velocity.x,
  y: bullet.y + bullet.velocity.y,
});

/** Moves a bullet: orbits circle the player, boomerangs turn around halfway. */
export const advanceBullet = (bullet: Bullet, player: Player): Bullet => {
  if (bullet.orbit !== null) {
    const angle = bullet.orbit.angle + bullet.orbit.speed;

    return {
      ...bullet,
      life: bullet.life - STEP,
      orbit: { ...bullet.orbit, angle },
      x: player.x + Math.cos(angle) * bullet.orbit.radius,
      y: player.y + Math.sin(angle) * bullet.orbit.radius,
    };
  }

  const moved = moveStraight(bullet);

  return bullet.isBoomerang &&
    !bullet.hasReturned &&
    moved.life < bullet.maxLife * HALF
    ? {
        ...moved,
        hasReturned: true,
        velocity: { x: -moved.velocity.x, y: -moved.velocity.y },
      }
    : moved;
};

const isExpired = (state: GameState, bullet: Bullet): boolean => {
  const limit = state.map.worldSize + COMBAT_TUNING.worldMargin;
  const isOutside = (coordinate: number): boolean =>
    coordinate < -COMBAT_TUNING.worldMargin || coordinate > limit;

  return bullet.life <= NONE || isOutside(bullet.x) || isOutside(bullet.y);
};

const toExplosions = (
  bullets: ReadonlyArray<Bullet>,
): ReadonlyArray<Explosion> =>
  bullets.flatMap((bullet) =>
    bullet.owner === "enemy" || bullet.explosionRadius === null
      ? []
      : [
          {
            color: bullet.color,
            damage: bullet.damage,
            radius: bullet.explosionRadius,
            x: bullet.x,
            y: bullet.y,
          },
        ],
  );

const detonateExpired = (
  state: GameState,
  expired: ReadonlyArray<Bullet>,
  random: Random,
): StepResult =>
  toExplosions(expired).reduce<StepResult>(
    (result, explosion) =>
      andThen(result, (current) => explode(current, explosion, random)),
    withoutEvents(state),
  );

const resolveEnemyBullet = (
  pass: BulletPass,
  bullet: Bullet,
  random: Random,
): BulletPass => {
  const { state } = pass.result;
  const isHit =
    state.player.invulnerableTicks <= NONE &&
    distanceBetween(bullet, state.player) < state.player.radius + bullet.size;

  return isHit
    ? {
        ...pass,
        result: andThen(pass.result, (current) =>
          damagePlayer(current, bullet.damage, random),
        ),
      }
    : { ...pass, survivors: [...pass.survivors, bullet] };
};

const resolvePlayerBullet = (
  pass: BulletPass,
  bullet: Bullet,
  random: Random,
): BulletPass => {
  const target = findBulletTarget(pass.result.state, bullet);

  if (target === undefined) {
    return { ...pass, survivors: [...pass.survivors, bullet] };
  }

  return {
    result: andThen(pass.result, (current) =>
      hitEnemy(current, { bullet, enemy: target }, random),
    ),
    survivors: survivesHit(bullet)
      ? [...pass.survivors, rememberHit(bullet, target.id)]
      : pass.survivors,
  };
};

/** Moves bullets, detonates expired explosives and resolves hits on the player and enemies. */
export const updateBullets = (
  state: GameState,
  context: StepContext,
): StepResult => {
  const moved = state.bullets.map((bullet) =>
    advanceBullet(bullet, state.player),
  );
  const detonated = detonateExpired(
    { ...state, bullets: [] },
    moved.filter((bullet) => isExpired(state, bullet)),
    context.random,
  );
  const pass = moved
    .filter((bullet) => !isExpired(state, bullet))
    .reduce<BulletPass>(
      (current, bullet) =>
        (bullet.owner === "enemy" ? resolveEnemyBullet : resolvePlayerBullet)(
          current,
          bullet,
          context.random,
        ),
      { result: detonated, survivors: [] },
    );

  return andThen(pass.result, (current) =>
    withoutEvents({ ...current, bullets: pass.survivors }),
  );
};
