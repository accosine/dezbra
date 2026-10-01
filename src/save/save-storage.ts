import { DEFAULT_SAVE_DATA, parseSaveData, type SaveData } from "./save-data";

/** Key under which the progress is stored. */
export const SAVE_STORAGE_KEY = "dead-pixels-save";

/** The part of the Web Storage API the game needs. */
export type SaveStorage = Pick<Storage, "getItem" | "setItem">;

/** Returns the browser storage or undefined where it is blocked (e.g. private mode). */
export const getBrowserStorage = (): SaveStorage | undefined => {
  try {
    return localStorage;
  } catch {
    return undefined;
  }
};

const readStoredText = (storage: SaveStorage): string | null => {
  try {
    return storage.getItem(SAVE_STORAGE_KEY);
  } catch {
    return null;
  }
};

const parseJson = (text: string): unknown => {
  try {
    const parsed: unknown = JSON.parse(text);

    return parsed;
  } catch {
    return undefined;
  }
};

/** Loads the progress; missing, blocked or corrupt storage yields the defaults. */
export const loadSaveData = (storage: SaveStorage | undefined): SaveData => {
  const stored = storage === undefined ? null : readStoredText(storage);

  return stored === null ? DEFAULT_SAVE_DATA : parseSaveData(parseJson(stored));
};

/** Stores the progress; returns false if the storage is unavailable or full. */
export const storeSaveData = (
  storage: SaveStorage | undefined,
  save: SaveData,
): boolean => {
  if (storage === undefined) {
    return false;
  }

  try {
    storage.setItem(SAVE_STORAGE_KEY, JSON.stringify(save));

    return true;
  } catch {
    return false;
  }
};
