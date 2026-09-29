import type { FloatingText, Particle } from "./entities";
import { HALF, NONE, STEP } from "../utils/numbers";
import { type Random, randomInteger } from "../utils/random";
import { type Vector, ZERO_VECTOR } from "../utils/vector";
import { FULL_TURN } from "../utils/math";
import type { GameState } from "./game-state";
import { PARTICLE_TUNING } from "./tuning";

/** Description of a single particle; `life` doubles as its maximum life. */
export type ParticleSpec = Readonly<{
  color: string;
  life: number;
  size: number;
  velocity: Vector;
  x: number;
  y: number;
}>;

/** Creates a moving square particle. */
export const createParticle = (spec: ParticleSpec): Particle => ({
  ...spec,
  isRing: false,
  maxLife: spec.life,
});

/** Creates an expanding ring (explosions, shield breaks). */
export const createRingParticle = (
  point: Vector,
  color: string,
  spec: Readonly<{ life: number; size: number }>,
): Particle => ({
  color,
  isRing: true,
  life: spec.life,
  maxLife: spec.life,
  size: spec.size,
  velocity: ZERO_VECTOR,
  x: point.x,
  y: point.y,
});

const createBloodParticle = (point: Vector, random: Random): Particle => {
  const angle = random() * FULL_TURN;
  const speed =
    PARTICLE_TUNING.bloodSpeedMinimum +
    random() * PARTICLE_TUNING.bloodSpeedRange;
  const life =
    PARTICLE_TUNING.bloodLifeMinimum +
    randomInteger(random, PARTICLE_TUNING.bloodLifeRange);
  const color =
    PARTICLE_TUNING[random() > HALF ? "bloodColor" : "bloodColorDark"];
  const size =
    PARTICLE_TUNING.bloodSizeMinimum +
    randomInteger(random, PARTICLE_TUNING.bloodSizeRange);

  return {
    color,
    isRing: false,
    life,
    maxLife: PARTICLE_TUNING.bloodMaxLife,
    size,
    velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
    x: point.x,
    y: point.y,
  };
};

/** Creates a burst of blood particles at a point. */
export const createBloodParticles = (
  point: Vector,
  count: number,
  random: Random,
): ReadonlyArray<Particle> =>
  Array.from({ length: count }, () => createBloodParticle(point, random));

/** Appends particles to the state. */
export const addParticles = (
  state: GameState,
  particles: ReadonlyArray<Particle>,
): GameState => ({ ...state, particles: [...state.particles, ...particles] });

/** Moves particles (with gravity) and removes expired ones. */
export const advanceParticles = (
  particles: ReadonlyArray<Particle>,
): ReadonlyArray<Particle> =>
  particles
    .map((particle) => ({
      ...particle,
      life: particle.life - STEP,
      velocity: {
        x: particle.velocity.x,
        y: particle.velocity.y + PARTICLE_TUNING.gravity,
      },
      x: particle.x + particle.velocity.x,
      y: particle.y + particle.velocity.y,
    }))
    .filter((particle) => particle.life > NONE);

/** Lets floating texts rise and removes expired ones. */
export const advanceFloats = (
  floats: ReadonlyArray<FloatingText>,
): ReadonlyArray<FloatingText> =>
  floats
    .map((float) => ({
      ...float,
      life: float.life - STEP,
      y: float.y - PARTICLE_TUNING.floatRise,
    }))
    .filter((float) => float.life > NONE);
