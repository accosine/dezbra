import { deepFreeze } from "../utils/deep-freeze";

/** Special behavior of a boss. */
export type BossAbility = "all" | "charge" | "poison" | "shield" | "summon";

/** A boss that appears at the start of its wave. */
export type BossDefinition = Readonly<{
  ability: BossAbility;
  color: string;
  contactDamage: number;
  health: number;
  icon: string;
  name: string;
  size: number;
  speed: number;
  wave: number;
}>;

/** All bosses in order of appearance. */
export const BOSSES: ReadonlyArray<BossDefinition> = deepFreeze([
  {
    ability: "charge",
    color: "#8b0000",
    contactDamage: 20,
    health: 450,
    icon: "👹",
    name: "FLEISCHBERG",
    size: 26,
    speed: 0.7,
    wave: 3,
  },
  {
    ability: "summon",
    color: "#4b0082",
    contactDamage: 15,
    health: 650,
    icon: "💀",
    name: "PESTPRIESTER",
    size: 24,
    speed: 0.42,
    wave: 5,
  },
  {
    ability: "poison",
    color: "#1e8449",
    contactDamage: 12,
    health: 550,
    icon: "🤢",
    name: "GIFTSPUCKER",
    size: 22,
    speed: 0.52,
    wave: 8,
  },
  {
    ability: "shield",
    color: "#2c2c3c",
    contactDamage: 25,
    health: 900,
    icon: "⚔️",
    name: "TODESRITTER",
    size: 28,
    speed: 0.58,
    wave: 12,
  },
  {
    ability: "all",
    color: "#1a0030",
    contactDamage: 30,
    health: 1600,
    icon: "👁️",
    name: "ALPTRAUM",
    size: 34,
    speed: 0.48,
    wave: 18,
  },
]);

/** Returns the boss that belongs to a wave, if any. */
export const findBossForWave = (wave: number): BossDefinition | undefined =>
  BOSSES.find((boss): boolean => boss.wave === wave);
