import { addParticles, createParticle } from "./particles";
import type { GameState, PlayerStats } from "./game-state";
import { NONE, STEP } from "../utils/numbers";
import { PLAYER_TUNING, TICKS_PER_SECOND } from "./tuning";
import { type Vector, ZERO_VECTOR } from "../utils/vector";

const SHIELD_COLOR = "#4fc3f7";
const SHIELD_SPARK = { life: 20, size: 20 };

const regenerate = (stats: PlayerStats): PlayerStats => {
  if (stats.regeneration <= NONE) {
    return stats;
  }

  const regenerationTicks = stats.regenerationTicks + STEP;

  return regenerationTicks >= PLAYER_TUNING.regenerationInterval
    ? {
        ...stats,
        health: Math.min(stats.maxHealth, stats.health + stats.regeneration),
        regenerationTicks: NONE,
      }
    : { ...stats, regenerationTicks };
};

const rechargeShield = (stats: PlayerStats): PlayerStats => {
  if (stats.hasShield || stats.shieldCooldownTicks <= NONE) {
    return stats;
  }

  const shieldCooldownTicks = stats.shieldCooldownTicks - STEP;

  return {
    ...stats,
    hasShield: shieldCooldownTicks <= NONE,
    shieldCooldownTicks,
  };
};

const isSoldierShieldDue = (state: GameState): boolean => {
  const period = PLAYER_TUNING.soldierShieldPeriodSeconds * TICKS_PER_SECOND;

  return (
    state.character.id === "soldier" &&
    !state.stats.hasShield &&
    state.stats.shieldCooldownTicks <= NONE &&
    state.progress.frame > NONE &&
    state.progress.frame % period === NONE
  );
};

const grantSoldierShield = (state: GameState): GameState =>
  isSoldierShieldDue(state)
    ? addParticles({ ...state, stats: { ...state.stats, hasShield: true } }, [
        createParticle({
          color: SHIELD_COLOR,
          velocity: ZERO_VECTOR,
          x: state.player.x,
          y: state.player.y,
          ...SHIELD_SPARK,
        }),
      ])
    : state;

const isGhostDashing = (state: GameState, movement: Vector): boolean =>
  state.character.id === "ghost" &&
  (Math.abs(movement.x) > PLAYER_TUNING.ghostInputThreshold ||
    Math.abs(movement.y) > PLAYER_TUNING.ghostInputThreshold);

const countDownInvulnerability = (
  state: GameState,
  movement: Vector,
): number => {
  const remaining = Math.max(NONE, state.player.invulnerableTicks - STEP);

  return remaining <= NONE && isGhostDashing(state, movement)
    ? PLAYER_TUNING.ghostInvulnerableTicks
    : remaining;
};

/** Advances invulnerability, regeneration, shield recharge and character passives. */
export const updatePlayerTimers = (
  state: GameState,
  movement: Vector,
): GameState =>
  grantSoldierShield({
    ...state,
    player: {
      ...state.player,
      invulnerableTicks: countDownInvulnerability(state, movement),
    },
    stats: rechargeShield(regenerate(state.stats)),
  });
