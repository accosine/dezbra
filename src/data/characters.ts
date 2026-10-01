import { deepFreeze } from "../utils/deep-freeze";
import type { UnlockRequirement } from "./unlock-requirement";
import type { WeaponId } from "./weapons";

/** Identifiers of playable characters. */
export type CharacterId =
  "anna" | "blitz" | "ghost" | "hans" | "soldier" | "zara";

/** How a stat chip on the character card is highlighted. */
export type StatTone = "bad" | "good" | "neutral";

/** A stat chip shown on the character card. */
export type CharacterStat = Readonly<{
  label: string;
  tone: StatTone;
  value: string;
}>;

/** A playable character; `startWeapons` may repeat an ID to start at a higher level. */
export type CharacterDefinition = Readonly<{
  avatar: string;
  role: string;
  color: string;
  cooldownMultiplier: number;
  damageMultiplier: number;
  description: string;
  health: number;
  id: CharacterId;
  name: string;
  passive: string;
  speed: number;
  startWeapons: ReadonlyArray<WeaponId>;
  stats: ReadonlyArray<CharacterStat>;
  unlock: UnlockRequirement | null;
}>;

/** All characters, keyed by ID. */
export const CHARACTERS: Readonly<Record<CharacterId, CharacterDefinition>> =
  deepFreeze({
    anna: {
      avatar: "🎯",
      color: "#e74c3c",
      cooldownMultiplier: 1.15,
      damageMultiplier: 1.5,
      description: "+50% Schaden. Langsamer & weniger HP.",
      health: 80,
      id: "anna",
      name: "ANNA KRIEG",
      passive: "Präzisionsschüsse: +100% Schaden aus der Ferne",
      role: "SCHARFSCHÜTZIN",
      speed: 2.1,
      startWeapons: ["sniper", "pistol"],
      stats: [
        { label: "HP", tone: "bad", value: "●●○○○" },
        { label: "SPD", tone: "bad", value: "●●○○○" },
        { label: "DMG", tone: "good", value: "●●●●●" },
      ],
      unlock: {
        hint: "🔒 Erreiche 5.000 Punkte",
        statistic: "bestScore",
        threshold: 5000,
      },
    },
    blitz: {
      avatar: "⚡",
      color: "#f1c40f",
      cooldownMultiplier: 0.52,
      damageMultiplier: 0.75,
      description: "Superschnelle Feuerrate. Weniger Schaden.",
      health: 90,
      id: "blitz",
      name: "MAX BLITZ",
      passive: "Feuerrate +3% pro Level (max +50%)",
      role: "INGENIEUR",
      speed: 3,
      startWeapons: ["uzi", "uzi"],
      stats: [
        { label: "HP", tone: "neutral", value: "●●●○○" },
        { label: "SPD", tone: "good", value: "●●●●○" },
        { label: "RATE", tone: "good", value: "●●●●●" },
      ],
      unlock: {
        hint: "🔒 200 Gesamtkills",
        statistic: "totalKills",
        threshold: 200,
      },
    },
    ghost: {
      avatar: "👻",
      color: "#00d4ff",
      cooldownMultiplier: 0.8,
      damageMultiplier: 1.4,
      description: "Startet mit Fusion! Sehr schnell, wenig HP.",
      health: 70,
      id: "ghost",
      name: "SHADE X",
      passive: "Kugeln durchdringen Feinde. Kurze Unverwundbarkeit beim Laufen",
      role: "PHANTOM",
      speed: 3.5,
      startWeapons: ["hellfire"],
      stats: [
        { label: "HP", tone: "bad", value: "●○○○○" },
        { label: "SPD", tone: "good", value: "●●●●●" },
        { label: "FUSION", tone: "good", value: "★★★★★" },
      ],
      unlock: {
        hint: "🔒 3 Fusionen bauen",
        statistic: "fusionsBuilt",
        threshold: 3,
      },
    },
    hans: {
      avatar: "🛡️",
      color: "#95a5a6",
      cooldownMultiplier: 1.25,
      damageMultiplier: 0.9,
      description: "Unzerstörbar. Sehr langsam.",
      health: 200,
      id: "hans",
      name: "IRON HANS",
      passive: "Nimmt nur 65% Schaden. Startet mit Regen & Schild",
      role: "PANZER",
      speed: 1.7,
      startWeapons: ["shotgun"],
      stats: [
        { label: "HP", tone: "good", value: "●●●●●" },
        { label: "SPD", tone: "bad", value: "●○○○○" },
        { label: "ARM.", tone: "good", value: "●●●●●" },
      ],
      unlock: {
        hint: "🔒 5 Runs spielen",
        statistic: "runsPlayed",
        threshold: 5,
      },
    },
    soldier: {
      avatar: "🪖",
      color: "#85c1e9",
      cooldownMultiplier: 1,
      damageMultiplier: 1,
      description: "Ausgewogener Kämpfer für Einsteiger.",
      health: 100,
      id: "soldier",
      name: "SOLDAT",
      passive: "Schutzweste: Einmaliger Schild jede Minute",
      role: "STARTER",
      speed: 2.6,
      startWeapons: ["pistol"],
      stats: [
        { label: "HP", tone: "neutral", value: "●●●○○" },
        { label: "SPD", tone: "neutral", value: "●●●○○" },
        { label: "DMG", tone: "neutral", value: "●●●○○" },
      ],
      unlock: null,
    },
    zara: {
      avatar: "🔮",
      color: "#9b59b6",
      cooldownMultiplier: 0.85,
      damageMultiplier: 1.25,
      description: "Orbitale Magie. Wenig HP aber hoher Schaden.",
      health: 75,
      id: "zara",
      name: "ZARA VOID",
      passive: "Orbs verlangsamen und ziehen Feinde an",
      role: "MAGIERIN",
      speed: 2.3,
      startWeapons: ["magic", "boomerang"],
      stats: [
        { label: "HP", tone: "bad", value: "●○○○○" },
        { label: "MAGIE", tone: "good", value: "●●●●●" },
        { label: "DMG", tone: "good", value: "●●●●○" },
      ],
      unlock: {
        hint: "🔒 3 Bosse besiegen",
        statistic: "bossKills",
        threshold: 3,
      },
    },
  });

/** Character IDs in display order; the first one is always unlocked. */
export const CHARACTER_IDS: ReadonlyArray<CharacterId> = deepFreeze([
  "soldier",
  "anna",
  "blitz",
  "zara",
  "hans",
  "ghost",
]);

/** All characters in display order. */
export const CHARACTER_LIST: ReadonlyArray<CharacterDefinition> = deepFreeze(
  CHARACTER_IDS.map((characterId) => CHARACTERS[characterId]),
);
