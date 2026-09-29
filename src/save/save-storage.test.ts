import { afterEach, describe, expect, it } from "vitest";
import {
  getBrowserStorage,
  loadSaveData,
  SAVE_STORAGE_KEY,
  type SaveStorage,
  storeSaveData,
} from "./save-storage";
import { DEFAULT_SAVE_DATA } from "./save-data";

const STORED_SAVE = { ...DEFAULT_SAVE_DATA, bestScore: 900, coins: 40 };

const createMemoryStorage = (initial: string | null): SaveStorage => {
  const entries = new Map<string, string>();

  if (initial !== null) {
    entries.set(SAVE_STORAGE_KEY, initial);
  }

  return {
    getItem: (key: string): string | null => entries.get(key) ?? null,
    setItem: (key: string, value: string): void => {
      entries.set(key, value);
    },
  };
};

const failingStorage: SaveStorage = {
  getItem: (): string | null => {
    throw new Error("blocked");
  },
  setItem: (): void => {
    throw new Error("quota exceeded");
  },
};

const originalDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  "localStorage",
);

afterEach((): void => {
  if (originalDescriptor !== undefined) {
    Object.defineProperty(globalThis, "localStorage", originalDescriptor);
  }
});

describe("loadSaveData", (): void => {
  it("loads a stored save", (): void => {
    const storage = createMemoryStorage(JSON.stringify(STORED_SAVE));

    expect(loadSaveData(storage)).toEqual(STORED_SAVE);
  });

  it.each([
    { name: "missing storage", storage: undefined },
    { name: "empty storage", storage: createMemoryStorage(null) },
    { name: "corrupt JSON", storage: createMemoryStorage("{broken") },
    { name: "blocked storage", storage: failingStorage },
  ])("returns the defaults for $name", ({ storage }): void => {
    expect(loadSaveData(storage)).toEqual(DEFAULT_SAVE_DATA);
  });
});

describe("storeSaveData", (): void => {
  it("round-trips a save through the storage", (): void => {
    const storage = createMemoryStorage(null);

    expect(storeSaveData(storage, STORED_SAVE)).toBe(true);
    expect(loadSaveData(storage)).toEqual(STORED_SAVE);
  });

  it("reports failures instead of throwing", (): void => {
    expect(storeSaveData(undefined, STORED_SAVE)).toBe(false);
    expect(storeSaveData(failingStorage, STORED_SAVE)).toBe(false);
  });
});

describe("getBrowserStorage", (): void => {
  it("returns the browser storage", (): void => {
    expect(getBrowserStorage()).toBe(localStorage);
  });

  it("returns nothing when the browser blocks storage access", (): void => {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      get: (): never => {
        throw new Error("SecurityError");
      },
    });

    expect(getBrowserStorage()).toBeUndefined();
  });
});
