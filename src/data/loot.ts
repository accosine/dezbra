import { deepFreeze } from "../utils/deep-freeze";

/** Identifiers of chest rewards. */
export type LootId =
  | "bloodlust"
  | "critPlus"
  | "doubleBarrel"
  | "knowledgeShard"
  | "megaMedkit"
  | "nanoHealing"
  | "armorPlating"
  | "phoenixFeather"
  | "armorPiercing"
  | "shockField"
  | "stormBoots"
  | "superMagnet"
  | "timeCrystal"
  | "timeStop"
  | "vampireFang";

/** Card highlight of a chest reward (gold, purple, blue, red). */
export type LootTier = "blue" | "gold" | "purple" | "red";

/** A reward offered when opening a boss chest. */
export type LootDefinition = Readonly<{
  description: string;
  icon: string;
  id: LootId;
  name: string;
  tier: LootTier;
}>;

/** All chest rewards in the order of the original game. */
export const LOOT: ReadonlyArray<LootDefinition> = deepFreeze([
  {
    description: "Vollständige Heilung!",
    icon: "❤️",
    id: "megaMedkit",
    name: "MEGA MEDIKIT",
    tier: "gold",
  },
  {
    description: "Max-HP dauerhaft +60.",
    icon: "🛡️",
    id: "armorPlating",
    name: "PANZERPLATTE",
    tier: "gold",
  },
  {
    description: "Alle Waffen: Schaden +55%.",
    icon: "💥",
    id: "bloodlust",
    name: "BLUTDURST",
    tier: "gold",
  },
  {
    description: "Bewegung dauerhaft +35%.",
    icon: "💨",
    id: "stormBoots",
    name: "STURMSTIEFEL",
    tier: "purple",
  },
  {
    description: "Alle Feuerraten +38%.",
    icon: "⏱️",
    id: "timeCrystal",
    name: "ZEITKRISTALL",
    tier: "purple",
  },
  {
    description: "Projektilgröße +65%.",
    icon: "💫",
    id: "shockField",
    name: "SCHOCKFELD",
    tier: "purple",
  },
  {
    description: "Alle Kugeln durchdringen Feinde.",
    icon: "🔩",
    id: "armorPiercing",
    name: "PANZERBRECHEND",
    tier: "gold",
  },
  {
    description: "Einmalige Wiederbelebung!",
    icon: "☠️",
    id: "phoenixFeather",
    name: "PHÖNIXFEDER",
    tier: "gold",
  },
  {
    description: "+6 HP pro Sekunde.",
    icon: "💊",
    id: "nanoHealing",
    name: "NANOHEILUNG",
    tier: "purple",
  },
  {
    description: "+2 Kugeln pro Waffe.",
    icon: "✌️",
    id: "doubleBarrel",
    name: "DOPPELLÄUFE",
    tier: "gold",
  },
  {
    description: "XP-Radius ×5.",
    icon: "🧲",
    id: "superMagnet",
    name: "SUPERMAGNET",
    tier: "blue",
  },
  {
    description: "Sofort +3 Levels!",
    icon: "📚",
    id: "knowledgeShard",
    name: "WISSENSSPLITTER",
    tier: "purple",
  },
  {
    description: "Krit-Chance +25%.",
    icon: "⚡",
    id: "critPlus",
    name: "KRITISCH+",
    tier: "purple",
  },
  {
    description: "5% Schaden als HP zurück.",
    icon: "🧛",
    id: "vampireFang",
    name: "VAMPIR",
    tier: "red",
  },
  {
    description: "Feinde 3s eingefroren!",
    icon: "⏸️",
    id: "timeStop",
    name: "ZEITSTOPP",
    tier: "gold",
  },
]);
