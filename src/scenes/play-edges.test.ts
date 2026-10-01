import * as Phaser from "phaser";
import { afterEach, describe, expect, it } from "vitest";
import {
  bootGame,
  destroyGame,
  press,
  readTexts,
  requireScene,
  startScene,
  stepFrames,
  useGame,
  waitUntil,
} from "../harness/phaser-harness";
import { createMovementKeys, readHeldKeys } from "./play-input";
import { DEFAULT_SAVE_DATA, type SaveData } from "../save/save-data";
import { writeSave, writeSelection } from "./game-registry";
import { ChestScene } from "./chest-scene";
import { createGameTextures } from "../render/game-textures";
import { createStubScene } from "../harness/stub-scene";
import { createTestState } from "../sim/sim-fixtures";
import { GameOverScene } from "./game-over-scene";
import type { GameState } from "../sim/game-state";
import { HudScene } from "./hud-scene";
import { Joystick } from "../ui/joystick";
import { PlayScene } from "./play-scene";
import { SCENE_KEYS } from "./scene-keys";

const getGame = useGame([
  createStubScene("idle"),
  PlayScene,
  HudScene,
  ChestScene,
  GameOverScene,
  createStubScene(SCENE_KEYS.menu),
]);
const VIEW = { height: 830, width: 430 };
const PENDING = 2;
const NONE = 0;
const WAVE_END = 1700;
const BEST = 9000;
const FIRST_LEVEL = 1;
const FRAME_MS = 17;
const BACKGROUND_TAB_MS = 10_000;
const MAX_CATCH_UP_TICKS = 5;
const BIG_COMBO = 12;
const COMBO_TICKS = 100;
const EVERYTHING: SaveData = {
  ...DEFAULT_SAVE_DATA,
  bestScore: BEST,
  unlockedCharacters: ["soldier", "anna", "blitz", "zara", "hans", "ghost"],
  unlockedMaps: ["city", "industrial", "cemetery", "wasteland"],
};

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

describe("PlayScene before a run", (): void => {
  it("has no state, offers or report", (): void => {
    const play = new PlayScene();

    expect([play.snapshot, play.runReport, play.level]).toEqual([
      null,
      null,
      FIRST_LEVEL,
    ]);
    expect([...play.pendingUpgrades, ...play.pendingLoot]).toEqual([]);
  });

  it("only simulates restored runs while it was never started", async (): Promise<void> => {
    const game = await bootGame([createStubScene("waiting"), PlayScene]);
    const play = requireScene(game, SCENE_KEYS.play, PlayScene);
    const state = createTestState();

    play.update(NONE, FRAME_MS);
    play.restoreState(state);
    play.update(NONE, BACKGROUND_TAB_MS);

    expect(play.snapshot?.progress.frame).toBe(
      state.progress.frame + MAX_CATCH_UP_TICKS,
    );
    destroyGame(game);
  });

  it("works without a keyboard", async (): Promise<void> => {
    const game = await bootGame([createStubScene("keyless")], {
      input: { keyboard: false },
    });
    const keys = createMovementKeys(
      requireScene(game, "keyless", Phaser.Scene),
    );

    expect(readHeldKeys(keys)).toEqual({
      down: false,
      left: false,
      right: false,
      up: false,
    });
    destroyGame(game);
  });
});

describe("HUD details", (): void => {
  it("shows the best score, pulses near the wave end and steers with the joystick", async (): Promise<void> => {
    writeSave(getGame().registry, EVERYTHING);

    const play = await startRun();
    const state = requireSnapshot(play);
    const hud = requireScene(getGame(), SCENE_KEYS.hud, HudScene);
    const joystick = hud.children.list.find(
      (child): child is Joystick => child instanceof Joystick,
    );

    play.restoreState({
      ...state,
      progress: {
        ...state.progress,
        combo: BIG_COMBO,
        comboTicks: COMBO_TICKS,
        waveTicks: WAVE_END,
      },
    });
    joystick?.list
      .at(NONE)
      ?.emit(
        Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN,
        hud.input.activePointer,
      );
    stepFrames(getGame(), PENDING);

    expect(readTexts(hud)).toEqual(expect.arrayContaining(["BEST: 9.000"]));
  });
});

describe("chest details", (): void => {
  it("keeps the chest open while a second chest waits", async (): Promise<void> => {
    const play = await startRun();
    const state = requireSnapshot(play);

    play.restoreState({
      ...state,
      phase: "chest",
      progress: { ...state.progress, pendingChests: PENDING },
    });
    await waitUntil(() => getGame().scene.isActive(SCENE_KEYS.chest));
    press(
      requireScene(getGame(), SCENE_KEYS.chest, ChestScene),
      play.pendingLoot.at(NONE)?.name ?? "",
    );

    play.chooseUpgrade({
      description: "",
      icon: "",
      kind: "perk",
      name: "",
      perkId: "speed",
      rarity: "common",
    });

    expect(requireSnapshot(play).phase).toBe("chest");
    expect(getGame().scene.isActive(SCENE_KEYS.chest)).toBe(true);
  });
});

describe("game over details", (): void => {
  it("reports the best combo, a new best score and a finished collection", async (): Promise<void> => {
    writeSave(getGame().registry, EVERYTHING);

    const play = await startRun();
    const state = requireSnapshot(play);

    play.restoreState({
      ...state,
      phase: "dead",
      progress: { ...state.progress, bestCombo: PENDING, score: BEST + BEST },
    });
    await waitUntil(() => getGame().scene.isActive(SCENE_KEYS.gameOver));
    play.chooseLoot("megaMedkit");

    const gameOver = requireScene(
      getGame(),
      SCENE_KEYS.gameOver,
      GameOverScene,
    );

    expect(readTexts(gameOver)).toEqual(
      expect.arrayContaining(["⭐ 18.000", "BEST COMBO: ×2"]),
    );
  });
});
