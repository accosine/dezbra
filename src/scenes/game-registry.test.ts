import * as Phaser from "phaser";
import { afterEach, describe, expect, it } from "vitest";
import {
  readSave,
  readSelection,
  recordUnlocks,
  updateSave,
  writeSave,
  writeSelection,
} from "./game-registry";
import { DEFAULT_SAVE_DATA } from "../save/save-data";
import { loadSaveData } from "../save/save-storage";

const COINS = 30;
const VETERAN = { ...DEFAULT_SAVE_DATA, runsPlayed: 3 };

const createRegistry = (): Phaser.Data.DataManager =>
  new Phaser.Data.DataManager(new Phaser.Events.EventEmitter());

afterEach((): void => {
  localStorage.clear();
});

describe("save in the registry", (): void => {
  it("reads defaults, writes and persists changes", (): void => {
    const registry = createRegistry();

    expect(readSave(registry)).toEqual(DEFAULT_SAVE_DATA);
    updateSave(registry, (save) => ({ ...save, coins: COINS }));
    expect(readSave(registry).coins).toBe(COINS);
    expect(loadSaveData(localStorage).coins).toBe(COINS);
  });

  it("records new unlocks once", (): void => {
    const registry = createRegistry();

    writeSave(registry, VETERAN);
    expect(recordUnlocks(registry)).toEqual([
      { kind: "map", name: "INDUSTRIEGEBIET" },
    ]);
    expect(recordUnlocks(registry)).toEqual([]);
  });
});

describe("selection in the registry", (): void => {
  it("defaults to the soldier in the city and ignores invalid values", (): void => {
    const registry = createRegistry();

    expect(readSelection(registry)).toEqual({
      characterId: "soldier",
      mapId: "city",
    });
    registry.set("selection", "broken");
    expect(readSelection(registry)).toEqual({
      characterId: "soldier",
      mapId: "city",
    });
  });

  it("changes parts of the selection", (): void => {
    const registry = createRegistry();

    writeSelection(registry, { characterId: "ghost" });
    writeSelection(registry, { mapId: "wasteland" });
    expect(readSelection(registry)).toEqual({
      characterId: "ghost",
      mapId: "wasteland",
    });
  });
});
