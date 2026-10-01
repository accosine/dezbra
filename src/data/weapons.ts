import { deepFreeze } from "../utils/deep-freeze";

/** Weapons a character can start with or find. */
export type BaseWeaponId =
  | "boomerang"
  | "grenade"
  | "laser"
  | "magic"
  | "pistol"
  | "shotgun"
  | "sniper"
  | "uzi";

/** Weapons created by combining two base weapons. */
export type FusionWeaponId =
  "deathray" | "doomshotgun" | "hellfire" | "napalm" | "tempest" | "voidorb";

/** Any weapon identifier. */
export type WeaponId = BaseWeaponId | FusionWeaponId;

/** Static description of a weapon; `interval` is the fire interval in ticks. */
export type WeaponDefinition = Readonly<{
  color: string;
  damage: number;
  description: string;
  icon: string;
  id: WeaponId;
  interval: number;
  maxLevel: number;
  name: string;
  recipe: readonly [BaseWeaponId, BaseWeaponId] | null;
}>;

/** All weapons of the game, keyed by ID. */
export const WEAPONS: Readonly<Record<WeaponId, WeaponDefinition>> = deepFreeze(
  {
    boomerang: {
      color: "#e67e22",
      damage: 14,
      description: "Kehrt zurück, trifft zweimal",
      icon: "🪃",
      id: "boomerang",
      interval: 90,
      maxLevel: 5,
      name: "BUMERANG",
      recipe: null,
    },
    deathray: {
      color: "#00d4ff",
      damage: 60,
      description: "SCHARFSCHÜTZE + LASER\nMassiver Energiestrahl",
      icon: "🌊",
      id: "deathray",
      interval: 75,
      maxLevel: 1,
      name: "TODESSTRAHL",
      recipe: ["sniper", "laser"],
    },
    doomshotgun: {
      color: "#ffd700",
      damage: 30,
      description: "SCHROTFLINTE + SCHARFSCHÜTZE\nHochkaliber-Fächersalve",
      icon: "💀",
      id: "doomshotgun",
      interval: 52,
      maxLevel: 1,
      name: "APOKALYPSE",
      recipe: ["shotgun", "sniper"],
    },
    grenade: {
      color: "#aab7b8",
      damage: 50,
      description: "Große Explosion beim Aufprall",
      icon: "💣",
      id: "grenade",
      interval: 92,
      maxLevel: 5,
      name: "GRANATE",
      recipe: null,
    },
    hellfire: {
      color: "#ff4500",
      damage: 9,
      description: "UZI + SCHROTFLINTE\nExplosives Dauerfeuer-Inferno",
      icon: "🌋",
      id: "hellfire",
      interval: 9,
      maxLevel: 1,
      name: "HÖLLENFEUER",
      recipe: ["uzi", "shotgun"],
    },
    laser: {
      color: "#ff0040",
      damage: 18,
      description: "Durchdringender Energiestrahl",
      icon: "🔴",
      id: "laser",
      interval: 28,
      maxLevel: 5,
      name: "LASER",
      recipe: null,
    },
    magic: {
      color: "#9b59b6",
      damage: 12,
      description: "Orbitale Kugeln um dich herum",
      icon: "🔮",
      id: "magic",
      interval: 60,
      maxLevel: 5,
      name: "MAGIESTAB",
      recipe: null,
    },
    napalm: {
      color: "#ff6b00",
      damage: 35,
      description: "GRANATE + UZI\nFeuerteppich-Bomben",
      icon: "☄️",
      id: "napalm",
      interval: 68,
      maxLevel: 1,
      name: "NAPALM",
      recipe: ["grenade", "uzi"],
    },
    pistol: {
      color: "#85c1e9",
      damage: 9,
      description: "Einzel-Schuss auf nächsten Feind",
      icon: "🔫",
      id: "pistol",
      interval: 50,
      maxLevel: 5,
      name: "PISTOLE",
      recipe: null,
    },
    shotgun: {
      color: "#f0a500",
      damage: 7,
      description: "5 Kugeln breites Fächer",
      icon: "💥",
      id: "shotgun",
      interval: 82,
      maxLevel: 5,
      name: "SCHROTFLINTE",
      recipe: null,
    },
    sniper: {
      color: "#e74c3c",
      damage: 38,
      description: "Hoher Schaden, penetrierend",
      icon: "🎯",
      id: "sniper",
      interval: 108,
      maxLevel: 5,
      name: "SCHARFSCHÜTZE",
      recipe: null,
    },
    tempest: {
      color: "#4fc3f7",
      damage: 5,
      description: "PISTOLE + UZI\nMini-Gun-Sturm in alle Richtungen",
      icon: "🌪️",
      id: "tempest",
      interval: 5,
      maxLevel: 1,
      name: "STURMWIND",
      recipe: ["pistol", "uzi"],
    },
    uzi: {
      color: "#2ecc71",
      damage: 3,
      description: "Schnelles Dauerfeuer",
      icon: "⚡",
      id: "uzi",
      interval: 14,
      maxLevel: 5,
      name: "UZI",
      recipe: null,
    },
    voidorb: {
      color: "#8a2be2",
      damage: 24,
      description: "MAGIESTAB + BUMERANG\nSchwarzloch-Orbs saugen Feinde an",
      icon: "🌑",
      id: "voidorb",
      interval: 44,
      maxLevel: 1,
      name: "LEERER ORB",
      recipe: ["magic", "boomerang"],
    },
  },
);

/** Weapon IDs in the order of the original catalog. */
export const WEAPON_IDS: ReadonlyArray<WeaponId> = deepFreeze([
  "pistol",
  "shotgun",
  "uzi",
  "sniper",
  "magic",
  "boomerang",
  "grenade",
  "laser",
  "hellfire",
  "deathray",
  "voidorb",
  "doomshotgun",
  "tempest",
  "napalm",
]);

/** Returns true if the weapon is built from two others. */
export const isFusionWeapon = (weapon: WeaponDefinition): boolean =>
  weapon.recipe !== null;
