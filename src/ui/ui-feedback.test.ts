import * as Phaser from "phaser";
import {
  createPointer,
  stepFrames,
  useHarnessScene,
} from "../harness/phaser-harness";
import { describe, expect, it, vi } from "vitest";
import { Joystick, JOYSTICK_LAYOUT } from "./joystick";
import { getStreakMessage } from "./streak-message";
import { showBanner } from "./banner";
import type { Vector } from "../utils/vector";

const getScene = useHarnessScene();
const BANNER_FRAMES = 160;
const PUSH = 100;
const HALF_PUSH = 22;
const NO_MOVEMENT = { x: 0, y: 0 };

const recordMovements = (): Readonly<{
  onChange: (movement: Vector) => void;
  readings: ReadonlyArray<Vector>;
}> => {
  const readings: Array<Vector> = [];

  return {
    onChange: (movement: Vector): void => {
      readings.push(movement);
    },
    readings,
  };
};

describe("getStreakMessage", (): void => {
  it.each([
    { color: "#f39c12", combo: 5, text: "🔥 5× COMBO!" },
    { color: "#ff4444", combo: 10, text: "💥 10× COMBO!!" },
    { color: "#ff0040", combo: 25, text: "🔥 25× COMBO!" },
    { color: "#f1c40f", combo: 3, text: "🔥 3× COMBO!" },
  ])("announces a $combo combo", ({ color, combo, text }): void => {
    expect(getStreakMessage(combo)).toEqual({ color, text });
  });
});

describe("showBanner", (): void => {
  it("shows the text and removes it after a while", (): void => {
    const scene = getScene();
    const banner = showBanner(scene, "WELLE 2", { color: "#2ecc71" });

    expect(banner.text).toBe("WELLE 2");
    expect(banner.active).toBe(true);
    stepFrames(scene.game, BANNER_FRAMES);
    expect(banner.active).toBe(false);
  });

  it("can be moved away from the center", (): void => {
    const scene = getScene();
    const centered = showBanner(scene, "A", { color: "#ffffff" });
    const moved = showBanner(scene, "B", {
      color: "#ffffff",
      offsetY: PUSH,
      size: HALF_PUSH,
    });

    expect(moved.y - centered.y).toBe(PUSH);
  });
});

describe("Joystick", (): void => {
  it("reports clamped movement while dragged and stops on release", (): void => {
    const scene = getScene();
    const { onChange, readings } = recordMovements();
    const joystick = new Joystick(scene, onChange);
    const [base] = joystick.list;
    const pointer = createPointer(scene, {
      x: JOYSTICK_LAYOUT.x + HALF_PUSH,
      y: JOYSTICK_LAYOUT.y,
    });

    base?.emit(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, pointer);
    pointer.x = JOYSTICK_LAYOUT.x + PUSH;
    scene.input.emit(Phaser.Input.Events.POINTER_MOVE, pointer);
    scene.input.emit(Phaser.Input.Events.POINTER_UP, pointer);

    expect(readings).toEqual([{ x: 0.5, y: 0 }, { x: 1, y: 0 }, NO_MOVEMENT]);
  });

  it("ignores other pointers", (): void => {
    const scene = getScene();
    const onChange = vi.fn<(movement: Vector) => void>();
    const joystick = new Joystick(scene, onChange);
    const stranger = createPointer(scene, { x: PUSH, y: PUSH });

    scene.input.emit(Phaser.Input.Events.POINTER_MOVE, stranger);
    scene.input.emit(Phaser.Input.Events.POINTER_UP, stranger);

    expect(onChange).not.toHaveBeenCalled();
    expect(joystick.depth).toBe(JOYSTICK_LAYOUT.depth);
  });
});
