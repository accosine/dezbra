import { afterEach, describe, expect, it } from "vitest";
import {
  press,
  readTexts,
  requireScene,
  startScene,
  useGame,
  waitUntil,
} from "../harness/phaser-harness";
import { readSelection, writeSave, writeSelection } from "./game-registry";
import { CharacterSelectScene } from "./character-select-scene";
import { createStubScene } from "../harness/stub-scene";
import { DEFAULT_SAVE_DATA } from "../save/save-data";
import { MapSelectScene } from "./map-select-scene";
import { SCENE_KEYS } from "./scene-keys";

const getGame = useGame([
  createStubScene("idle"),
  CharacterSelectScene,
  MapSelectScene,
  createStubScene(SCENE_KEYS.play),
]);
const VETERAN = { ...DEFAULT_SAVE_DATA, bestScore: 6000, runsPlayed: 3 };

afterEach((): void => {
  localStorage.clear();
});

describe("CharacterSelectScene", (): void => {
  it("lists all characters and locks those not earned yet", async (): Promise<void> => {
    const game = getGame();

    writeSave(game.registry, DEFAULT_SAVE_DATA);
    await startScene(game, SCENE_KEYS.characterSelect);

    const scene = requireScene(
      game,
      SCENE_KEYS.characterSelect,
      CharacterSelectScene,
    );

    expect(readTexts(scene)).toEqual(
      expect.arrayContaining(["SOLDAT", "SHADE X", "🔒 3 Fusionen bauen"]),
    );
    expect(() => {
      press(scene, "ANNA KRIEG");
    }).toThrow(Error);
  });

  it("announces unlocks, selects a character and continues", async (): Promise<void> => {
    const game = getGame();

    writeSave(game.registry, VETERAN);
    await startScene(game, SCENE_KEYS.characterSelect);

    const scene = requireScene(
      game,
      SCENE_KEYS.characterSelect,
      CharacterSelectScene,
    );

    expect(readTexts(scene)).toEqual(
      expect.arrayContaining([
        "🔓 ANNA KRIEG FREIGESCHALTET!",
        "🗺️ INDUSTRIEGEBIET FREI!",
      ]),
    );
    press(scene, "ANNA KRIEG");
    expect(readSelection(game.registry).characterId).toBe("anna");
    press(scene, "WEITER → KARTE WÄHLEN ▶");
    await waitUntil(() => game.scene.isActive(SCENE_KEYS.mapSelect));
  });
});

describe("MapSelectScene", (): void => {
  it("selects an unlocked map and starts the run", async (): Promise<void> => {
    const game = getGame();

    writeSave(game.registry, {
      ...VETERAN,
      unlockedMaps: ["city", "industrial"],
    });
    writeSelection(game.registry, { mapId: "city" });
    await startScene(game, SCENE_KEYS.mapSelect);

    const scene = requireScene(game, SCENE_KEYS.mapSelect, MapSelectScene);

    expect(readTexts(scene)).toEqual(
      expect.arrayContaining(["🔒 5 Bosse besiegen"]),
    );
    press(scene, "INDUSTRIEGEBIET");
    expect(readSelection(game.registry).mapId).toBe("industrial");
    press(scene, "▶ SPIELEN STARTEN");
    await waitUntil(() => game.scene.isActive(SCENE_KEYS.play));
  });
});
