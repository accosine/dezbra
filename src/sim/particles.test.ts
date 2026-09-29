import {
  addParticles,
  advanceFloats,
  advanceParticles,
  createBloodParticles,
  createParticle,
  createRingParticle,
} from "./particles";
import { createTestState, sequenceRandom } from "./sim-fixtures";
import { describe, expect, it } from "vitest";
import { PARTICLE_TUNING } from "./tuning";

const ORIGIN = { x: 100, y: 50 };
const BLOOD_COUNT = 4;
const ROLL = { high: 0.9, low: 0.1 };
const SPARK = {
  color: "#ffffff",
  life: 2,
  size: 3,
  velocity: { x: 1, y: 2 },
  x: 0,
  y: 0,
};
const SINGLE = 1;
const FLOAT = {
  color: "#f1c40f",
  isBig: false,
  life: 2,
  text: "+10",
  x: 5,
  y: 10,
};

describe("particle creation", (): void => {
  it("creates blood bursts in both blood colors", (): void => {
    const particles = createBloodParticles(
      ORIGIN,
      BLOOD_COUNT,
      sequenceRandom([ROLL.low, ROLL.high]),
    );

    expect(particles).toHaveLength(BLOOD_COUNT);
    expect(new Set(particles.map((particle) => particle.color))).toEqual(
      new Set([PARTICLE_TUNING.bloodColor, PARTICLE_TUNING.bloodColorDark]),
    );
    expect(
      particles.every(
        (particle) => particle.x === ORIGIN.x && !particle.isRing,
      ),
    ).toBe(true);
  });

  it("creates rings and sparks that remember their full life", (): void => {
    const ring = createRingParticle(ORIGIN, "#4fc3f7", { life: 18, size: 65 });

    expect(ring).toMatchObject({
      isRing: true,
      life: 18,
      maxLife: 18,
      size: 65,
    });
    expect(createParticle(SPARK)).toMatchObject({
      isRing: false,
      maxLife: SPARK.life,
    });
  });

  it("appends particles to the state", (): void => {
    const state = addParticles(createTestState(), [createParticle(SPARK)]);

    expect(state.particles).toHaveLength(SINGLE);
  });
});

describe("particle movement", (): void => {
  it("moves particles with gravity and removes expired ones", (): void => {
    const [moved] = advanceParticles([createParticle(SPARK)]);

    expect(moved).toMatchObject({ life: 1, x: 1, y: 2 });
    expect(moved?.velocity.y).toBeCloseTo(
      SPARK.velocity.y + PARTICLE_TUNING.gravity,
    );
    const spark = createParticle(SPARK);

    expect(advanceParticles(advanceParticles([spark]))).toEqual([]);
  });

  it("lets floating texts rise until they expire", (): void => {
    const [risen] = advanceFloats([FLOAT]);

    expect(risen).toMatchObject({
      life: 1,
      y: FLOAT.y - PARTICLE_TUNING.floatRise,
    });
    expect(advanceFloats(advanceFloats([FLOAT]))).toEqual([]);
  });
});
