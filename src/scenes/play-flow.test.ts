import * as Phaser from "phaser";
import { afterEach, describe, expect, it } from "vitest";
import {
  press,
  readTexts,
  requireScene,
  startScene,
  stepFrames,
  useGame,
  waitUntil,
} from "../harness/phaser-harness";
import { readSave, writeSave, writeSelection } from "./game-registry";
import { ChestScene } from "./chest-scene";
import { createGameTextures } from "../render/game-textures";
import { createStubScene } from "../harness/stub-scene";
import { DEFAULT_SAVE_DATA } from "../save/save-data";
import { GameOverScene } from "./game-over-scene";
import type { GameState } from "../sim/game-state";
import { HudScene } from "./hud-scene";
import { PlayScene } from "./play-scene";
import { SCENE_KEYS } from "./scene-keys";
import { UpgradeScene } from "./upgrade-scene";

const getGame = useGame([
  createStubScene("idle"),
  PlayScene,
  HudScene,
  UpgradeScene,
  ChestScene,
  GameOverScene,
  createStubScene(SCENE_KEYS.menu),
  createStubScene(SCENE_KEYS.characterSelect),
]);
const VIEW = { height: 830, width: 430 };
const FRAMES = 20;
const PENDING = 2;
const SINGLE = 1;
const NONE = 0;

const startRun = async (): Promise<PlayScene> => {
  const game = getGame();

  const idle = requireScene(game, "idle", Phaser.Scene);

  createGameTextures(idle, VIEW);
  writeSelection(game.registry, { characterId: "soldier", mapId: "city" });
  await startScene(game, SCENE_KEYS.play);
  await waitUntil(() => game.scene.isActive(SCENE_KEYS.hud));

  return requireScene(game, SCENE_KEYS.play, PlayScene);
};

const requireSnapshot = (play: PlayScene): GameState => {
  const state = play.snapshot;

  if (state === null) {
    throw new Error("The run has not started.");
  }

  return state;
};

afterEach((): void => {
  localStorage.clear();
});

describe("PlayScene run", (): void => {
  it("counts the run, shows the HUD and moves with the joystick", async (): Promise<void> => {
    writeSave(getGame().registry, DEFAULT_SAVE_DATA);

    const play = await startRun();
    const start = requireSnapshot(play).player.x;

    play.setJoystick({ x: 1, y: 0 });
    stepFrames(getGame(), FRAMES);

    expect(readSave(getGame().registry).runsPlayed).toBe(SINGLE);
    expect([...play.pendingUpgrades, ...play.pendingLoot]).toEqual([]);
    expect(requireSnapshot(play).player.x).toBeGreaterThan(start);
    const hud = requireScene(getGame(), SCENE_KEYS.hud, HudScene);

    expect(readTexts(hud)).toEqual(expect.arrayContaining(["LEBEN", "LVL 1"]));
  });
});

describe("PlayScene overlays", (): void => {
  it("offers every pending level-up and continues afterwards", async (): Promise<void> => {
    const play = await startRun();
    const state = requireSnapshot(play);

    play.restoreState({
      ...state,
      phase: "upgrade",
      progress: { ...state.progress, pendingLevelUps: PENDING },
    });
    await waitUntil(() => getGame().scene.isActive(SCENE_KEYS.upgrade));
    press(
      requireScene(getGame(), SCENE_KEYS.upgrade, UpgradeScene),
      play.pendingUpgrades.at(NONE)?.name ?? "",
    );
    expect(requireSnapshot(play).phase).toBe("upgrade");
    press(
      requireScene(getGame(), SCENE_KEYS.upgrade, UpgradeScene),
      play.pendingUpgrades.at(NONE)?.name ?? "",
    );
    expect(requireSnapshot(play).phase).toBe("playing");
    await waitUntil(() => !getGame().scene.isActive(SCENE_KEYS.upgrade));
  });

  it("opens a boss chest", async (): Promise<void> => {
    const play = await startRun();
    const state = requireSnapshot(play);

    play.restoreState({
      ...state,
      phase: "chest",
      progress: { ...state.progress, pendingChests: SINGLE },
    });
    await waitUntil(() => getGame().scene.isActive(SCENE_KEYS.chest));

    const lootWithoutLevelUp = play.pendingLoot.find(
      (loot) => loot.id !== "knowledgeShard",
    );

    press(
      requireScene(getGame(), SCENE_KEYS.chest, ChestScene),
      lootWithoutLevelUp?.name ?? "",
    );
    expect(requireSnapshot(play).phase).toBe("playing");
    await waitUntil(() => !getGame().scene.isActive(SCENE_KEYS.chest));
  });
});

describe("PlayScene ending", (): void => {
  it("reports the run and offers a retry", async (): Promise<void> => {
    const play = await startRun();

    play.restoreState({ ...requireSnapshot(play), phase: "dead" });
    await waitUntil(() => getGame().scene.isActive(SCENE_KEYS.gameOver));

    const gameOver = requireScene(
      getGame(),
      SCENE_KEYS.gameOver,
      GameOverScene,
    );

    expect(play.runReport?.summary.score).toBe(NONE);
    expect(readTexts(gameOver)).toEqual(
      expect.arrayContaining([
        "DU BIST TOT",
        "NÄCHSTES ZIEL: 🔒 Erreiche 5.000 Punkte",
      ]),
    );
    press(gameOver, "↺ NOCHMAL");
    await waitUntil(() => getGame().scene.isActive(SCENE_KEYS.characterSelect));
  });
});
