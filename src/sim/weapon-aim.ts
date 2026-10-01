import type { AimKind, WeaponPattern } from "./weapon-patterns";
import { HALF, NONE, STEP } from "../utils/numbers";
import { type Random, randomCentered } from "../utils/random";
import { FULL_TURN } from "../utils/math";

/** Inputs for the angle of the bullet at `index` within a volley of `count`. */
export type AimContext = Readonly<{
  baseAngle: number;
  count: number;
  frame: number;
  index: number;
  pattern: WeaponPattern;
  random: Random;
}>;

type AimFunction = (context: AimContext) => number;

const circleAngle = (context: AimContext): number =>
  (context.index / context.count) * FULL_TURN +
  context.frame * context.pattern.rotationSpeed;

const AIM_FUNCTIONS: Readonly<Record<AimKind, AimFunction>> = {
  centeredSteps: (context) =>
    context.baseAngle + (context.index - STEP) * context.pattern.spread,
  fan: (context) =>
    context.baseAngle +
    (context.index / Math.max(STEP, context.count - STEP) - HALF) *
      context.pattern.spread,
  firstExact: (context) =>
    context.index === NONE
      ? context.baseAngle
      : context.baseAngle +
        randomCentered(context.random, context.pattern.spread),
  orbit: circleAngle,
  random: (context) =>
    context.baseAngle + randomCentered(context.random, context.pattern.spread),
  randomTarget: (context) => context.baseAngle,
  ring: circleAngle,
  steps: (context) =>
    context.baseAngle + context.index * context.pattern.spread,
  stepsAfterFirst: (context) =>
    context.index === NONE
      ? context.baseAngle
      : context.baseAngle + (context.index - STEP) * context.pattern.spread,
};

/** Returns the flight angle (radians) of one bullet of a volley. */
export const aimBullet = (context: AimContext): number =>
  AIM_FUNCTIONS[context.pattern.aim](context);
