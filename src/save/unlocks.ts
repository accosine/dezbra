import { type CharacterId, CHARACTERS } from "../data/characters";
import {
  isRequirementMet,
  type UnlockRequirement,
} from "../data/unlock-requirement";
import { MAP_IDS, type MapId, MAPS } from "../data/maps";
import { getProgressStatistics } from "./progress";
import type { SaveData } from "./save-data";

/** A character or map that became available. */
export type Unlock = Readonly<{ kind: "character" | "map"; name: string }>;

/** The save after unlocking plus everything that was newly unlocked. */
export type UnlockResult = Readonly<{
  newlyUnlocked: ReadonlyArray<Unlock>;
  save: SaveData;
}>;

type Unlockable<Identifier> = Readonly<{
  id: Identifier;
  name: string;
  unlock: UnlockRequirement | null;
}>;

const MAP_LIST = MAP_IDS.map((mapId) => MAPS[mapId]);

const findNewUnlocks = <Identifier>(
  candidates: ReadonlyArray<Unlockable<Identifier>>,
  unlocked: ReadonlyArray<Identifier>,
  save: SaveData,
): ReadonlyArray<Unlockable<Identifier>> =>
  candidates.filter(
    (candidate) =>
      candidate.unlock !== null &&
      !unlocked.includes(candidate.id) &&
      isRequirementMet(candidate.unlock, getProgressStatistics(save)),
  );

/** Returns true if the character can be selected. */
export const isCharacterUnlocked = (
  save: SaveData,
  characterId: CharacterId,
): boolean => save.unlockedCharacters.includes(characterId);

/** Returns true if the map can be selected. */
export const isMapUnlocked = (save: SaveData, mapId: MapId): boolean =>
  save.unlockedMaps.includes(mapId);

/** Unlocks every character and map whose requirement is met. */
export const applyUnlocks = (save: SaveData): UnlockResult => {
  const characters = findNewUnlocks(CHARACTERS, save.unlockedCharacters, save);
  const maps = findNewUnlocks(MAP_LIST, save.unlockedMaps, save);

  return {
    newlyUnlocked: [
      ...characters.map((character): Unlock => ({
        kind: "character",
        name: character.name,
      })),
      ...maps.map((map): Unlock => ({ kind: "map", name: map.name })),
    ],
    save: {
      ...save,
      unlockedCharacters: [
        ...save.unlockedCharacters,
        ...characters.map((character) => character.id),
      ],
      unlockedMaps: [...save.unlockedMaps, ...maps.map((map) => map.id)],
    },
  };
};

/** Returns the hint of the first locked character or map, if any. */
export const findNextUnlockHint = (save: SaveData): string | undefined => {
  const lockedCharacter = CHARACTERS.find(
    (character) => !isCharacterUnlocked(save, character.id),
  );
  const lockedMap = MAP_LIST.find((map) => !isMapUnlocked(save, map.id));

  return (lockedCharacter ?? lockedMap)?.unlock?.hint;
};
