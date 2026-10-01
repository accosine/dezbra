import { deepFreeze } from "../utils/deep-freeze";
import type { WeaponId } from "../data/weapons";

/** How the bullets of one volley are angled. */
export type AimKind =
  | "centeredSteps"
  | "fan"
  | "firstExact"
  | "orbit"
  | "random"
  | "randomTarget"
  | "ring"
  | "steps"
  | "stepsAfterFirst";

/** Whether bullets pierce: always, never or only with the pierce perk. */
export type PierceRule = "always" | "never" | "perk";

/** Volley shape of a weapon; speeds in pixels per tick, `life` in ticks. */
export type WeaponPattern = Readonly<{
  aim: AimKind;
  baseCount: number;
  countPerExtra: number;
  countPerLevel: number;
  explosionRadius: number | null;
  isBlackHole: boolean;
  isBoomerang: boolean;
  isLaser: boolean;
  life: number;
  orbitRadius: number;
  pierce: PierceRule;
  rotationSpeed: number;
  sizeMultiplier: number;
  speed: number;
  spread: number;
}>;

const DEFAULT_PATTERN: WeaponPattern = {
  aim: "firstExact",
  baseCount: 1,
  countPerExtra: 1,
  countPerLevel: 0,
  explosionRadius: null,
  isBlackHole: false,
  isBoomerang: false,
  isLaser: false,
  life: 56,
  orbitRadius: 0,
  pierce: "perk",
  rotationSpeed: 0,
  sizeMultiplier: 4,
  speed: 9,
  spread: 0,
};

/** Volley shapes of all weapons, transcribed from the original fire routine. */
export const WEAPON_PATTERNS: Readonly<Record<WeaponId, WeaponPattern>> =
  deepFreeze({
    boomerang: {
      ...DEFAULT_PATTERN,
      aim: "steps",
      isBoomerang: true,
      life: 86,
      pierce: "never",
      speed: 8,
      spread: 0.42,
    },
    deathray: {
      ...DEFAULT_PATTERN,
      aim: "centeredSteps",
      baseCount: 3,
      isLaser: true,
      life: 9999,
      pierce: "always",
      sizeMultiplier: 8,
      speed: 27,
      spread: 0.09,
    },
    doomshotgun: {
      ...DEFAULT_PATTERN,
      aim: "fan",
      baseCount: 9,
      explosionRadius: 40,
      life: 66,
      pierce: "always",
      speed: 15,
      spread: 0.95,
    },
    grenade: {
      ...DEFAULT_PATTERN,
      explosionRadius: 68,
      life: 102,
      pierce: "never",
      speed: 6,
      spread: 0.28,
    },
    hellfire: {
      ...DEFAULT_PATTERN,
      aim: "random",
      baseCount: 7,
      explosionRadius: 44,
      life: 50,
      pierce: "never",
      speed: 11,
      spread: 0.5,
    },
    laser: {
      ...DEFAULT_PATTERN,
      aim: "stepsAfterFirst",
      isLaser: true,
      life: 9999,
      pierce: "always",
      speed: 22,
      spread: 0.12,
    },
    magic: {
      ...DEFAULT_PATTERN,
      aim: "orbit",
      baseCount: 4,
      countPerLevel: 1,
      life: 3,
      orbitRadius: 80,
      rotationSpeed: 0.022,
    },
    napalm: {
      ...DEFAULT_PATTERN,
      aim: "randomTarget",
      baseCount: 4,
      explosionRadius: 72,
      life: 92,
      pierce: "never",
      speed: 7,
    },
    pistol: { ...DEFAULT_PATTERN, life: 64, speed: 10, spread: 0.3 },
    shotgun: {
      ...DEFAULT_PATTERN,
      aim: "fan",
      baseCount: 5,
      life: 46,
      spread: 0.74,
    },
    sniper: {
      ...DEFAULT_PATTERN,
      life: 9999,
      pierce: "always",
      speed: 24,
      spread: 0.1,
    },
    tempest: {
      ...DEFAULT_PATTERN,
      aim: "ring",
      baseCount: 10,
      countPerExtra: 2,
      rotationSpeed: 0.075,
      speed: 12,
    },
    uzi: {
      ...DEFAULT_PATTERN,
      aim: "random",
      life: 46,
      speed: 12,
      spread: 0.2,
    },
    voidorb: {
      ...DEFAULT_PATTERN,
      aim: "orbit",
      baseCount: 7,
      isBlackHole: true,
      life: 3,
      orbitRadius: 100,
      pierce: "always",
      rotationSpeed: 0.042,
    },
  });
