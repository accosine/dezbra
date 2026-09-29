import { deepFreeze } from "../utils/deep-freeze";

/** Identifiers of permanent shop upgrades. */
export type ShopItemId =
  | "endurance"
  | "phoenix"
  | "rapidFire"
  | "startArmor"
  | "startShield"
  | "xpBoost";

/** A permanent upgrade bought with coins. */
export type ShopItemDefinition = Readonly<{
  description: string;
  icon: string;
  id: ShopItemId;
  name: string;
  price: number;
}>;

/** All shop items in display order. */
export const SHOP_ITEMS: ReadonlyArray<ShopItemDefinition> = deepFreeze([
  {
    description: "Startet mit +30 max HP.",
    icon: "❤️",
    id: "startArmor",
    name: "STARTPANZERUNG",
    price: 150,
  },
  {
    description: "Jeder Run beginnt mit Schild.",
    icon: "🛡️",
    id: "startShield",
    name: "STARTSCHILD",
    price: 200,
  },
  {
    description: "Permanent +20% XP.",
    icon: "📚",
    id: "xpBoost",
    name: "XP-BOOST",
    price: 180,
  },
  {
    description: "Permanent +10% Schaden.",
    icon: "💪",
    id: "endurance",
    name: "DAUERTRAINING",
    price: 220,
  },
  {
    description: "Permanent -10% Feuerintervall.",
    icon: "🔄",
    id: "rapidFire",
    name: "SCHNELLFEUER",
    price: 200,
  },
  {
    description: "Startet mit Wiederbelebung.",
    icon: "💎",
    id: "phoenix",
    name: "PHÖNIX",
    price: 300,
  },
]);
