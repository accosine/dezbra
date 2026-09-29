import { type CharacterId, CHARACTERS } from "../data/characters";
import { MAP_IDS, type MapId } from "../data/maps";
import { SHOP_ITEMS, type ShopItemId } from "../data/shop-items";
import { deepFreeze } from "../utils/deep-freeze";

/** Persistent progress across runs. */
export type SaveData = Readonly<{
  bestScore: number;
  bossKills: number;
  coins: number;
  fusionsBuilt: number;
  purchasedItems: ReadonlyArray<ShopItemId>;
  runsPlayed: number;
  totalKills: number;
  unlockedCharacters: ReadonlyArray<CharacterId>;
  unlockedMaps: ReadonlyArray<MapId>;
}>;

type CounterKey = Exclude<
  keyof SaveData,
  "purchasedItems" | "unlockedCharacters" | "unlockedMaps"
>;

type UnknownRecord = Readonly<Record<string, unknown>>;

/** Progress of a fresh installation: only the soldier and the city are available. */
export const DEFAULT_SAVE_DATA: SaveData = deepFreeze({
  bestScore: 0,
  bossKills: 0,
  coins: 0,
  fusionsBuilt: 0,
  purchasedItems: [],
  runsPlayed: 0,
  totalKills: 0,
  unlockedCharacters: ["soldier"],
  unlockedMaps: ["city"],
});

const CHARACTER_IDS: ReadonlyArray<CharacterId> = CHARACTERS.map(
  (character) => character.id,
);
const SHOP_ITEM_IDS: ReadonlyArray<ShopItemId> = SHOP_ITEMS.map(
  (item) => item.id,
);

const isRecord = (candidate: unknown): candidate is UnknownRecord =>
  typeof candidate === "object" && candidate !== null;

const isCounter = (candidate: unknown): candidate is number =>
  typeof candidate === "number" &&
  Number.isFinite(candidate) &&
  candidate >= DEFAULT_SAVE_DATA.bestScore;

const readCounter = (record: UnknownRecord, key: CounterKey): number => {
  const candidate = record[key];

  return isCounter(candidate) ? Math.floor(candidate) : DEFAULT_SAVE_DATA[key];
};

const readIdentifiers = <Identifier extends string>(
  candidate: unknown,
  knownIdentifiers: ReadonlyArray<Identifier>,
  requiredIdentifiers: ReadonlyArray<Identifier>,
): ReadonlyArray<Identifier> => {
  const stored = Array.isArray(candidate) ? candidate : [];

  return knownIdentifiers.filter(
    (identifier) =>
      requiredIdentifiers.includes(identifier) || stored.includes(identifier),
  );
};

const readCounters = (
  record: UnknownRecord,
): Readonly<Record<CounterKey, number>> => ({
  bestScore: readCounter(record, "bestScore"),
  bossKills: readCounter(record, "bossKills"),
  coins: readCounter(record, "coins"),
  fusionsBuilt: readCounter(record, "fusionsBuilt"),
  runsPlayed: readCounter(record, "runsPlayed"),
  totalKills: readCounter(record, "totalKills"),
});

/** Validates untrusted stored data; unknown or invalid fields fall back to defaults. */
export const parseSaveData = (candidate: unknown): SaveData => {
  const record = isRecord(candidate) ? candidate : {};

  return {
    ...readCounters(record),
    purchasedItems: readIdentifiers(record.purchasedItems, SHOP_ITEM_IDS, []),
    unlockedCharacters: readIdentifiers(
      record.unlockedCharacters,
      CHARACTER_IDS,
      DEFAULT_SAVE_DATA.unlockedCharacters,
    ),
    unlockedMaps: readIdentifiers(
      record.unlockedMaps,
      MAP_IDS,
      DEFAULT_SAVE_DATA.unlockedMaps,
    ),
  };
};
