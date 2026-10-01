import { describe, expect, it } from "vitest";
import { createGameTextures } from "./game-textures";
import { createTestState } from "../sim/sim-fixtures";
import { FloatTextView } from "./float-text-view";
import type { GameState } from "../sim/game-state";
import { PlayerView } from "./player-view";
import { ScreenEffects } from "./screen-effects";
import { useHarnessScene } from "../harness/phaser-harness";

const getScene = useHarnessScene();
const VIEW = { height: 830, width: 430 };
const BLINK_FRAME = 4;
const SHOWN_FRAME = 6;
const INVULNERABLE = 35;
const NONE = 0;
const ONE_FLOAT = 1;
const ALL_TINTS = 3;
const FLOATS = [
  { color: "#f1c40f", isBig: false, life: 30, text: "+10", x: 1, y: 2 },
  { color: "#ff6b6b", isBig: true, life: 5, text: "×5 150", x: 3, y: 4 },
];

const hurt = (state: GameState, frame: number): GameState => ({
  ...state,
  player: { ...state.player, facing: -1, invulnerableTicks: INVULNERABLE },
  progress: { ...state.progress, frame },
  stats: { ...state.stats, hasShield: true },
});

describe("PlayerView", (): void => {
  it("blinks while invulnerable and shows the shield otherwise", (): void => {
    const scene = getScene();
    const state = createTestState();

    createGameTextures(scene, VIEW);

    const view = new PlayerView(scene, state);

    view.update(hurt(state, BLINK_FRAME));
    expect(view.isVisible).toBe(false);
    view.update(hurt(state, SHOWN_FRAME));
    expect(view.isVisible).toBe(true);
    view.update({ ...state, weapons: [] });
    expect(view.isVisible).toBe(true);
  });
});

describe("FloatTextView", (): void => {
  it("shows one pooled text per float", (): void => {
    const view = new FloatTextView(getScene());

    view.update(FLOATS);
    expect(view.visibleTexts).toEqual(["+10", "×5 150"]);
    view.update(FLOATS.slice(NONE, ONE_FLOAT));
    expect(view.visibleTexts).toEqual(["+10"]);
  });
});

describe("ScreenEffects", (): void => {
  it("tints the screen for level-ups, hits and freezes", (): void => {
    const scene = getScene();
    const state = createTestState();

    createGameTextures(scene, VIEW);

    const effects = new ScreenEffects(scene, VIEW);

    effects.update(state);
    expect(effects.activeTints).toBe(NONE);
    effects.update({
      ...state,
      player: { ...state.player, invulnerableTicks: INVULNERABLE },
      progress: { ...state.progress, freezeTicks: 10, levelFlashTicks: 10 },
    });
    expect(effects.activeTints).toBe(ALL_TINTS);
  });
});
