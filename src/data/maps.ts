import type { DecorType } from "./decor-shapes";
import { deepFreeze } from "../utils/deep-freeze";
import type { UnlockRequirement } from "./unlock-requirement";

/** Identifiers of the playable maps. */
export type MapId = "cemetery" | "city" | "industrial" | "wasteland";

/** Wall colors of a building style: base fill and top highlight. */
export type WallPalette = Readonly<{ base: string; highlight: string }>;

/** A playable map; distances are world pixels, multipliers scale enemies and XP. */
export type MapDefinition = Readonly<{
  blockSize: number;
  buildingDamageChance: number;
  cardColor: string;
  color: string;
  decorTypes: ReadonlyArray<DecorType>;
  description: string;
  enemyMultiplier: number;
  features: ReadonlyArray<string>;
  groundColor: string;
  healBonus: number;
  icon: string;
  id: MapId;
  minimapBuildingColor: string;
  minimapTint: string;
  name: string;
  roadLineColor: string;
  roofColors: ReadonlyArray<string>;
  sidewalkColor: string;
  speedMultiplier: number;
  stainColor: string;
  stainCount: number;
  unlock: UnlockRequirement | null;
  wallPalettes: ReadonlyArray<WallPalette>;
  worldSize: number;
  xpMultiplier: number;
}>;

/** All maps, keyed by ID. */
export const MAPS: Readonly<Record<MapId, MapDefinition>> = deepFreeze({
  cemetery: {
    blockSize: 240,
    buildingDamageChance: 0.78,
    cardColor: "#06050e",
    color: "#9b59b6",
    decorTypes: [
      "grave",
      "grave",
      "tomb",
      "crypt",
      "cross",
      "grave",
      "obelisk",
    ],
    description: "Grabsteine & Katakomben. +50% Boss-Chancen.",
    enemyMultiplier: 1.4,
    features: ["Massiv", "Gräber", "Nebel", "+40% XP"],
    groundColor: "#06060e",
    healBonus: 10,
    icon: "⚰️",
    id: "cemetery",
    minimapBuildingColor: "#14122a",
    minimapTint: "#050514",
    name: "VERGESSENER FRIEDHOF",
    roadLineColor: "#141430",
    roofColors: ["#08080e", "#0c080e", "#0a0812", "#08080c", "#060608"],
    sidewalkColor: "#0c0c1c",
    speedMultiplier: 1,
    stainColor: "#320064",
    stainCount: 300,
    unlock: {
      hint: "🔒 5 Bosse besiegen",
      statistic: "bossKills",
      threshold: 5,
    },
    wallPalettes: [
      { base: "#14141e", highlight: "#20202c" },
      { base: "#12101c", highlight: "#1c1828" },
      { base: "#181224", highlight: "#221a30" },
      { base: "#101018", highlight: "#1a1a24" },
      { base: "#0e1018", highlight: "#18182c" },
    ],
    worldSize: 4200,
    xpMultiplier: 1.4,
  },
  city: {
    blockSize: 200,
    buildingDamageChance: 0.32,
    cardColor: "#0a0f0a",
    color: "#85c1e9",
    decorTypes: ["car", "car", "barrel", "lamp", "crate", "car", "fireHydrant"],
    description: "Verwinkelte Straßen & Gebäude. Viel Deckung.",
    enemyMultiplier: 1,
    features: ["Grosse Welt", "Gebäude", "Autos", "Nacht"],
    groundColor: "#0f1310",
    healBonus: 0,
    icon: "🏙️",
    id: "city",
    minimapBuildingColor: "#1e2620",
    minimapTint: "#050c05",
    name: "VERLASSENE STADT",
    roadLineColor: "#1a1e1a",
    roofColors: ["#101020", "#1a0e0e", "#0e1620", "#160808", "#0c0c1a"],
    sidewalkColor: "#161a16",
    speedMultiplier: 1,
    stainColor: "#640000",
    stainCount: 200,
    unlock: null,
    wallPalettes: [
      { base: "#28283a", highlight: "#34345a" },
      { base: "#382a1a", highlight: "#4a3828" },
      { base: "#1a283a", highlight: "#263448" },
      { base: "#2a1c1c", highlight: "#381e1e" },
      { base: "#20203a", highlight: "#2c2c52" },
    ],
    worldSize: 3200,
    xpMultiplier: 1,
  },
  industrial: {
    blockSize: 280,
    buildingDamageChance: 0.32,
    cardColor: "#0a0904",
    color: "#f0a500",
    decorTypes: ["tank", "pipe", "barrel", "crate", "vent", "drum", "craneArm"],
    description: "Riesige Fabriken & Lagerhäuser. +25% Feinde.",
    enemyMultiplier: 1.25,
    features: ["Sehr Groß", "Fabriken", "+25% Feinde", "+20% XP"],
    groundColor: "#0e0b08",
    healBonus: 0,
    icon: "🏭",
    id: "industrial",
    minimapBuildingColor: "#1e180a",
    minimapTint: "#140f05",
    name: "INDUSTRIEGEBIET",
    roadLineColor: "#201808",
    roofColors: ["#0e0c06", "#081408", "#141006", "#0c0808", "#081208"],
    sidewalkColor: "#161210",
    speedMultiplier: 1,
    stainColor: "#003c00",
    stainCount: 200,
    unlock: {
      hint: "🔒 3 Runs spielen",
      statistic: "runsPlayed",
      threshold: 3,
    },
    wallPalettes: [
      { base: "#2a200e", highlight: "#38300a" },
      { base: "#1c2a1a", highlight: "#24361e" },
      { base: "#282816", highlight: "#36361c" },
      { base: "#201818", highlight: "#2c2020" },
      { base: "#1a201a", highlight: "#242c22" },
    ],
    worldSize: 3800,
    xpMultiplier: 1.2,
  },
  wasteland: {
    blockSize: 320,
    buildingDamageChance: 0.88,
    cardColor: "#100b04",
    color: "#e67e22",
    decorTypes: [
      "wreck",
      "rock",
      "cactus",
      "barrel",
      "sandDune",
      "wreck",
      "skull",
    ],
    description: "Offene Sandwüste. Keine Deckung. Maximale Action!",
    enemyMultiplier: 1.5,
    features: ["Riesig", "Offen", "Schnell", "+50% XP"],
    groundColor: "#100d06",
    healBonus: 10,
    icon: "🌵",
    id: "wasteland",
    minimapBuildingColor: "#201508",
    minimapTint: "#140c03",
    name: "ÖDLAND",
    roadLineColor: "#241c08",
    roofColors: ["#140e04", "#100806", "#180c04", "#120a04", "#160a04"],
    sidewalkColor: "#1a1408",
    speedMultiplier: 1.3,
    stainColor: "#502800",
    stainCount: 120,
    unlock: {
      hint: "🔒 20.000 Punkte",
      statistic: "bestScore",
      threshold: 20_000,
    },
    wallPalettes: [
      { base: "#2a1e0a", highlight: "#381e06" },
      { base: "#241808", highlight: "#301e06" },
      { base: "#201810", highlight: "#2c2008" },
      { base: "#281a0a", highlight: "#361e06" },
      { base: "#221808", highlight: "#2e1a06" },
    ],
    worldSize: 5000,
    xpMultiplier: 1.5,
  },
});

/** Map IDs in display order. */
export const MAP_IDS: ReadonlyArray<MapId> = deepFreeze([
  "city",
  "industrial",
  "cemetery",
  "wasteland",
]);
