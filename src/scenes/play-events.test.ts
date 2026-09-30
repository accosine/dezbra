import * as Phaser from "phaser";
import { afterEach, describe, expect, it } from "vitest";
import { createTestBoss, createTestEnemy } from "../sim/sim-fixtures";
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
import { toEnemyId } from "../sim/entities";
import { UpgradeScene } from "./upgrade-scene";

const getGame = useGame([
  createStubScene("idle"),
  PlayScene,
  HudScene,
  UpgradeScene,
  ChestScene,
  GameOverScene,
  createStubScene(SCENE_KEYS.menu),
]);
const VIEW = { height: 830, width: 430 };
const KEY_D = 68;
const FRAMES = 10;
const ALMOST_FUSED = 2;
const COMBO = 4;
const LAST_WAVE_TICK = 1799;
const TINY = 0.01;
const FIRST = 0;
const SINGLE = 1;
const SETTLE_FRAMES = 4;
const SHIELDED = 200;
const BOSS_ID = 99;

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

const pressKey = (type: "keydown" | "keyup", keyCode: number): void => {
  const event = new KeyboardEvent(type, { code: "KeyD", key: "d" });

  Object.defineProperty(event, "keyCode", { value: keyCode });
  dispatchEvent(event);
};

const hudTexts = (): ReadonlyArray<string> =>
  readTexts(requireScene(getGame(), SCENE_KEYS.hud, HudScene));

afterEach((): void => {
  localStorage.clear();
});

describe("PlayScene input", (): void => {
  it("moves with the keyboard", async (): Promise<void> => {
    const play = await startRun();
    const start = requireSnapshot(play).player.x;

    pressKey("keydown", KEY_D);
    stepFrames(getGame(), FRAMES);
    pressKey("keyup", KEY_D);

    expect(requireSnapshot(play).player.x).toBeGreaterThan(start);
  });
});

describe("PlayScene progress events", (): void => {
  it("records fusions and announces unlocks in the HUD", async (): Promise<void> => {
    writeSave(getGame().registry, {
      ...DEFAULT_SAVE_DATA,
      fusionsBuilt: ALMOST_FUSED,
    });

    const play = await startRun();
    const state = requireSnapshot(play);

    play.restoreState({
      ...state,
      phase: "upgrade",
      progress: { ...state.progress, pendingLevelUps: SINGLE },
      weapons: [
        { cooldownTicks: null, id: "uzi", level: 1 },
        { cooldownTicks: null, id: "shotgun", level: 1 },
      ],
    });
    await waitUntil(() => getGame().scene.isActive(SCENE_KEYS.upgrade));
    press(
      requireScene(getGame(), SCENE_KEYS.upgrade, UpgradeScene),
      "HÖLLENFEUER",
    );
    stepFrames(getGame(), SETTLE_FRAMES);

    expect(readSave(getGame().registry).fusionsBuilt).toBe(
      ALMOST_FUSED + SINGLE,
    );
    expect(hudTexts()).toEqual(
      expect.arrayContaining(["🔓 SHADE X FREIGESCHALTET!", "⚗ FUSION! 🌋"]),
    );
  });
});

describe("PlayScene HUD feedback", (): void => {
  it("shows wave banners, combo streaks, the boss bar and the combo counter", async (): Promise<void> => {
    const play = await startRun();
    const state = requireSnapshot(play);
    const victim = createTestEnemy({
      health: TINY,
      x: state.player.x,
      y: state.player.y,
    });
    const boss = createTestBoss("nightmare", {
      id: toEnemyId(BOSS_ID),
      x: state.player.x + VIEW.width,
      y: state.player.y,
    });

    play.restoreState({
      ...state,
      enemies: [victim, boss],
      player: { ...state.player, invulnerableTicks: SHIELDED },
      progress: {
        ...state.progress,
        combo: COMBO,
        comboTicks: 100,
        waveTicks: LAST_WAVE_TICK,
      },
      weapons: state.weapons.map((weapon) => ({ ...weapon, cooldownTicks: 1 })),
    });
    stepFrames(getGame(), SETTLE_FRAMES);

    expect(hudTexts()).toEqual(
      expect.arrayContaining(["🔥 5× COMBO!", "5× COMBO", "👁️ ALPTRAUM"]),
    );
    expect(hudTexts().some((text) => text.startsWith("WELLE 2"))).toBe(true);
    expect(requireSnapshot(play).progress.kills).toBeGreaterThan(FIRST);
  });
});
