import { deepFreeze } from "../utils/deep-freeze";

/** Rarity of an upgrade offer; decides weight and card color. */
export type Rarity = "common" | "epic" | "fusion" | "legendary" | "rare";

/** Identifiers of level-up perks. */
export type PerkId =
  | "area"
  | "cooldown"
  | "crit"
  | "damage"
  | "explosive"
  | "health"
  | "magnet"
  | "multifire"
  | "pierce"
  | "regeneration"
  | "revive"
  | "shield"
  | "speed"
  | "timelock"
  | "vampire"
  | "xpBoost";

/** A perk offered on level-up. */
export type PerkDefinition = Readonly<{
  description: string;
  icon: string;
  id: PerkId;
  name: string;
  rarity: Exclude<Rarity, "fusion">;
}>;

/** All perks in the order of the original game. */
export const PERKS: ReadonlyArray<PerkDefinition> = deepFreeze([
  {
    description: "+40 HP. Max-HP +20.",
    icon: "❤️",
    id: "health",
    name: "MEDIKIT",
    rarity: "common",
  },
  {
    description: "Bewegung +22%.",
    icon: "👟",
    id: "speed",
    name: "ADRENALIN",
    rarity: "common",
  },
  {
    description: "Schaden +25%.",
    icon: "💢",
    id: "damage",
    name: "KAMPFTRAINING",
    rarity: "rare",
  },
  {
    description: "Feuerrate +22%.",
    icon: "🔥",
    id: "cooldown",
    name: "SCHNELLFEUER",
    rarity: "rare",
  },
  {
    description: "XP-Radius ×2.",
    icon: "🧲",
    id: "magnet",
    name: "ANZIEHUNG",
    rarity: "common",
  },
  {
    description: "Einmaliger Schutz (15s CD).",
    icon: "🛡️",
    id: "shield",
    name: "SCHILD",
    rarity: "epic",
  },
  {
    description: "+3 HP pro Sekunde.",
    icon: "💊",
    id: "regeneration",
    name: "HEILUNG",
    rarity: "rare",
  },
  {
    description: "XP-Gewinn +35%.",
    icon: "📚",
    id: "xpBoost",
    name: "LERNKURVE",
    rarity: "common",
  },
  {
    description: "Projektilgröße +40%.",
    icon: "💫",
    id: "area",
    name: "SCHOCKWELLE",
    rarity: "epic",
  },
  {
    description: "Kugeln durchdringen alle Feinde.",
    icon: "🔩",
    id: "pierce",
    name: "PANZERBRECHEND",
    rarity: "epic",
  },
  {
    description: "Einmalige Wiederbelebung bei 1 HP.",
    icon: "☠️",
    id: "revive",
    name: "WIEDERKEHR",
    rarity: "legendary",
  },
  {
    description: "+1 Kugel pro Waffe.",
    icon: "✌️",
    id: "multifire",
    name: "SALVE",
    rarity: "epic",
  },
  {
    description: "15% Chance auf 3× Schaden.",
    icon: "⚡",
    id: "crit",
    name: "KRITISCH",
    rarity: "rare",
  },
  {
    description: "3% des Schadens als HP zurück.",
    icon: "🧛",
    id: "vampire",
    name: "VAMPIR",
    rarity: "epic",
  },
  {
    description: "Alle Kugeln explodieren beim Aufprall.",
    icon: "💥",
    id: "explosive",
    name: "SPRENGKOPF",
    rarity: "epic",
  },
  {
    description: "Feinde werden alle 20s eingefroren (3s).",
    icon: "⏸️",
    id: "timelock",
    name: "ZEITSTOPP",
    rarity: "legendary",
  },
]);
