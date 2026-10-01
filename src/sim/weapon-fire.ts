import { addParticles, createParticle } from "./particles";
import { angleBetween, distanceBetween } from "../utils/math";
import type { Bullet, WeaponSlot } from "./entities";
import { NONE, STEP } from "../utils/numbers";
import { type Random, randomCentered, randomInteger } from "../utils/random";
import { WEAPON_PATTERNS, type WeaponPattern } from "./weapon-patterns";
import { aimBullet } from "./weapon-aim";
import { createPlayerBullet } from "./bullet-factory";
import type { GameState } from "./game-state";
import type { Vector } from "../utils/vector";
import { WEAPON_TUNING } from "./tuning";
import { WEAPONS } from "../data/weapons";

const findNearestEnemyPosition = (state: GameState): Vector | undefined =>
  state.enemies.reduce<
    Readonly<{ distance: number; position: Vector | undefined }>
  >(
    (nearest, enemy) => {
      const distance = distanceBetween(state.player, enemy);

      return distance < nearest.distance
        ? { distance, position: enemy }
        : nearest;
    },
    { distance: Infinity, position: undefined },
  ).position;

const findTarget = (state: GameState): Vector =>
  findNearestEnemyPosition(state) ?? {
    x: state.player.x + state.player.facing * WEAPON_TUNING.fallbackRange,
    y: state.player.y,
  };

const pickRandomTarget = (state: GameState, random: Random): Vector =>
  state.enemies[randomInteger(random, state.enemies.length)] ?? {
    x: state.player.x + randomCentered(random, WEAPON_TUNING.napalmScatter),
    y: state.player.y + randomCentered(random, WEAPON_TUNING.napalmScatter),
  };

const countBullets = (
  state: GameState,
  slot: WeaponSlot,
  pattern: WeaponPattern,
): number =>
  pattern.baseCount +
  state.stats.extraProjectiles * pattern.countPerExtra +
  slot.level * pattern.countPerLevel;

const computeDamage = (state: GameState, slot: WeaponSlot): number =>
  WEAPONS[slot.id].damage *
  (STEP + WEAPON_TUNING.levelDamageBonus * (slot.level - STEP)) *
  state.stats.damageMultiplier;

type Volley = Readonly<{
  baseAngle: number;
  damage: number;
  random: Random;
  slot: WeaponSlot;
}>;

const createVolleyBullet = (
  state: GameState,
  volley: Volley,
  index: number,
): Bullet => {
  const pattern = WEAPON_PATTERNS[volley.slot.id];
  const baseAngle =
    pattern.aim === "randomTarget"
      ? angleBetween(state.player, pickRandomTarget(state, volley.random))
      : volley.baseAngle;
  const angle = aimBullet({
    baseAngle,
    count: countBullets(state, volley.slot, pattern),
    frame: state.progress.frame,
    index,
    pattern,
    random: volley.random,
  });
  const isOrbit = pattern.aim === "orbit";

  return createPlayerBullet(state, {
    ...pattern,
    angle,
    color: WEAPONS[volley.slot.id].color,
    damage: volley.damage,
    orbit: isOrbit
      ? { angle, radius: pattern.orbitRadius, speed: WEAPON_TUNING.orbitSpeed }
      : null,
    pierces:
      pattern.pierce === "always" ||
      (pattern.pierce === "perk" && state.stats.hasPierce),
    speed: isOrbit ? NONE : pattern.speed,
  });
};

const createMuzzleFlash = (state: GameState, slot: WeaponSlot): GameState =>
  addParticles(state, [
    createParticle({
      color: WEAPONS[slot.id].color,
      life: WEAPON_TUNING.muzzleLife,
      size: WEAPON_TUNING.muzzleSize,
      velocity: {
        x: state.player.facing * WEAPON_TUNING.muzzleSpeed,
        y: WEAPON_TUNING.muzzleRise,
      },
      x: state.player.x,
      y: state.player.y,
    }),
  ]);

/** Fires one volley of the weapon at the nearest enemy (or straight ahead). */
export const fireWeapon = (
  state: GameState,
  slot: WeaponSlot,
  random: Random,
): GameState => {
  const volley: Volley = {
    baseAngle: angleBetween(state.player, findTarget(state)),
    damage: computeDamage(state, slot),
    random,
    slot,
  };
  const bullets = Array.from(
    { length: countBullets(state, slot, WEAPON_PATTERNS[slot.id]) },
    (_bullet, index) => createVolleyBullet(state, volley, index),
  );

  return createMuzzleFlash(
    { ...state, bullets: [...state.bullets, ...bullets] },
    slot,
  );
};
