import * as Phaser from "phaser";
import { createTextStyle, FONT_SIZE } from "./text-style";
import { hexToNumber } from "../utils/color";

/** Fill, border and drop-shadow colors of a button. */
export type ButtonColors = Readonly<{
  border: string;
  fill: string;
  shadow: string;
}>;

/** Color schemes of the original buttons. */
export const BUTTON_COLORS: Readonly<
  Record<"blue" | "green" | "purple" | "red", ButtonColors>
> = {
  blue: { border: "#0e3451", fill: "#1a5276", shadow: "#081d2e" },
  green: { border: "#145a32", fill: "#1e8449", shadow: "#0b3b21" },
  purple: { border: "#4a1f5f", fill: "#7d3c98", shadow: "#350e4a" },
  red: { border: "#800000", fill: "#c0392b", shadow: "#500000" },
};

/** Placement, label and action of a button; `x`/`y` is its center. */
export type ButtonOptions = Readonly<{
  colors: ButtonColors;
  height?: number;
  label: string;
  onPress: () => void;
  width: number;
  x: number;
  y: number;
}>;

const BUTTON_LAYOUT = {
  border: 3,
  height: 44,
  pressOffset: 2,
  rest: 0,
  shadowOffset: 4,
};
const HALF = 0.5;

type BodyFrame = Readonly<{
  height: number;
  left: number;
  shadow: number;
  top: number;
}>;

const measureBody = (options: ButtonOptions, isPressed: boolean): BodyFrame => {
  const height = options.height ?? BUTTON_LAYOUT.height;
  const offset = BUTTON_LAYOUT[isPressed ? "pressOffset" : "rest"];

  return {
    height,
    left: -options.width * HALF + offset,
    shadow: BUTTON_LAYOUT[isPressed ? "pressOffset" : "shadowOffset"],
    top: -height * HALF + offset,
  };
};

const drawBody = (
  graphics: Phaser.GameObjects.Graphics,
  options: ButtonOptions,
  isPressed: boolean,
): void => {
  const frame = measureBody(options, isPressed);

  graphics.clear();
  graphics.fillStyle(hexToNumber(options.colors.shadow));
  graphics.fillRect(
    frame.left + frame.shadow,
    frame.top + frame.shadow,
    options.width,
    frame.height,
  );
  graphics.fillStyle(hexToNumber(options.colors.fill));
  graphics.fillRect(frame.left, frame.top, options.width, frame.height);
  graphics.lineStyle(BUTTON_LAYOUT.border, hexToNumber(options.colors.border));
  graphics.strokeRect(frame.left, frame.top, options.width, frame.height);
};

/** Creates a pixel-style button that triggers on release, with a pressed look. */
export const createButton = (
  scene: Phaser.Scene,
  options: ButtonOptions,
): Phaser.GameObjects.Container => {
  const height = options.height ?? BUTTON_LAYOUT.height;
  const body = scene.add.graphics();
  const label = scene.add
    .text(
      BUTTON_LAYOUT.rest,
      BUTTON_LAYOUT.rest,
      options.label,
      createTextStyle({
        align: "center",
        color: "#ffffff",
        size: FONT_SIZE.medium,
      }),
    )
    .setOrigin(HALF);
  const container = scene.add.container(options.x, options.y, [body, label]);
  const setPressed = (isPressed: boolean): void => {
    drawBody(body, options, isPressed);
    const offset = BUTTON_LAYOUT[isPressed ? "pressOffset" : "rest"];

    label.setPosition(offset, offset);
  };

  setPressed(false);
  container
    .setSize(options.width, height)
    .setInteractive({ useHandCursor: true })
    .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => setPressed(true))
    .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => setPressed(false))
    .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
      setPressed(false);
      options.onPress();
    });

  return container;
};
