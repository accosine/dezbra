import {
  addParticles,
  createBloodParticles,
  createRingParticle,
} from "./particles";
import {
  createBanner,
  type StepResult,
  withEvents,
  withoutEvents,
} from "./step-result";
import { KILL_TUNING, PLAYER_TUNING } from "./tuning";
import { type Random, randomCentered } from "../utils/random";
import type { GameState } from "./game-state";
import { NONE } from "../utils/numbers";

const SHIELD_COLOR = "#4fc3f7";
const REVIVE_COLOR = "#ffd700";
const DEATH_BURSTS = 3;
const DEATH_SPREAD = 22;

const breakShield = (state: GameState): StepResult =>
  withoutEvents(
    addParticles(
      {
        ...state,
        stats: {
          ...state.stats,
          hasShield: false,
          shieldCooldownTicks: PLAYER_TUNING.shieldCooldownTicks,
        },
      },
      [
        createRingParticle(state.player, SHIELD_COLOR, {
          life: PLAYER_TUNING.shieldRingLife,
          size: PLAYER_TUNING.shieldRingSize,
        }),
      ],
    ),
  );

const reducedDamage = (state: GameState, amount: number): number => {
  const damage = Math.floor(amount);

  return state.character.id === "hans"
    ? Math.floor(damage * PLAYER_TUNING.hansDamageRatio)
    : damage;
};

const revive = (state: GameState): StepResult =>
  withEvents(
    {
      ...state,
      progress: {
        ...state.progress,
        shakeMagnitude: PLAYER_TUNING.reviveShake,
      },
      stats: {
        ...state.stats,
        health: Math.floor(
          state.stats.maxHealth * PLAYER_TUNING.reviveHealthRatio,
        ),
        isReviveUsed: true,
      },
    },
    [createBanner("☠️ WIEDERKEHR!", REVIVE_COLOR)],
  );

const die = (state: GameState, random: Random): StepResult => {
  const bursts = Array.from({ length: DEATH_BURSTS }, () =>
    createBloodParticles(
      {
        x: state.player.x + randomCentered(random, DEATH_SPREAD),
        y: state.player.y + randomCentered(random, DEATH_SPREAD),
      },
      KILL_TUNING.bigBlood,
      random,
    ),
  ).flat();

  return withEvents(
    addParticles(
      {
        ...state,
        phase: "dead",
        progress: {
          ...state.progress,
          shakeMagnitude: PLAYER_TUNING.deathShake,
        },
      },
      bursts,
    ),
    [{ kind: "player-died" }],
  );
};

const applyHit = (state: GameState, damage: number): GameState => ({
  ...state,
  player: {
    ...state.player,
    invulnerableTicks: PLAYER_TUNING.invulnerableTicks,
  },
  progress: {
    ...state.progress,
    combo: NONE,
    comboTicks: NONE,
    lastStreakShown: NONE,
    shakeMagnitude: Math.min(
      PLAYER_TUNING.maxHitShake,
      damage * PLAYER_TUNING.shakePerDamage,
    ),
  },
  stats: { ...state.stats, health: state.stats.health - damage },
});

/** Damages the player: a shield absorbs the hit, a revive saves from death once. */
export const damagePlayer = (
  state: GameState,
  amount: number,
  random: Random,
): StepResult => {
  if (state.stats.hasShield) {
    return breakShield(state);
  }

  const hit = applyHit(state, reducedDamage(state, amount));

  if (hit.stats.health > NONE) {
    return withoutEvents(hit);
  }

  return hit.stats.hasRevive && !hit.stats.isReviveUsed
    ? revive(hit)
    : die(hit, random);
};
