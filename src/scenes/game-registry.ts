import type * as Phaser from "phaser";
import { applyUnlocks, type Unlock } from "../save/unlocks";
import { CHARACTER_IDS, type CharacterId } from "../data/characters";
import { getBrowserStorage, storeSaveData } from "../save/save-storage";
import { MAP_IDS, type MapId } from "../data/maps";
import { parseSaveData, type SaveData } from "../save/save-data";

/** Character and map chosen for the next run. */
export type Selection = Readonly<{ characterId: CharacterId; mapId: MapId }>;

const REGISTRY_KEYS = { save: "save", selection: "selection" };
const DEFAULT_SELECTION: Selection = { characterId: "soldier", mapId: "city" };

type Registry = Phaser.Data.DataManager;

/** Reads the progress from the registry (validated). */
export const readSave = (registry: Registry): SaveData => {
  const stored: unknown = registry.get(REGISTRY_KEYS.save);

  return parseSaveData(stored);
};

/** Puts the progress into the registry and persists it. */
export const writeSave = (registry: Registry, save: SaveData): void => {
  registry.set(REGISTRY_KEYS.save, save);
  storeSaveData(getBrowserStorage(), save);
};

/** Applies a change to the progress and persists the result. */
export const updateSave = (
  registry: Registry,
  change: (save: SaveData) => SaveData,
): SaveData => {
  const next = change(readSave(registry));

  writeSave(registry, next);

  return next;
};

/** Unlocks everything that became available and persists it. */
export const recordUnlocks = (registry: Registry): ReadonlyArray<Unlock> => {
  const { newlyUnlocked, save } = applyUnlocks(readSave(registry));

  writeSave(registry, save);

  return newlyUnlocked;
};

const readField = (candidate: unknown, field: keyof Selection): unknown =>
  typeof candidate === "object" && candidate !== null
    ? Object.getOwnPropertyDescriptor(candidate, field)?.value
    : undefined;

/** Reads the current selection; unknown values fall back to soldier and city. */
export const readSelection = (registry: Registry): Selection => {
  const stored: unknown = registry.get(REGISTRY_KEYS.selection);
  const characterId = CHARACTER_IDS.find(
    (candidate) => candidate === readField(stored, "characterId"),
  );
  const mapId = MAP_IDS.find(
    (candidate) => candidate === readField(stored, "mapId"),
  );

  return {
    characterId: characterId ?? DEFAULT_SELECTION.characterId,
    mapId: mapId ?? DEFAULT_SELECTION.mapId,
  };
};

/** Changes part of the selection. */
export const writeSelection = (
  registry: Registry,
  change: Partial<Selection>,
): void => {
  registry.set(REGISTRY_KEYS.selection, {
    ...readSelection(registry),
    ...change,
  });
};
