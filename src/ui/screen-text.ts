import type * as Phaser from "phaser";
import { createIconStyle, createTextStyle, FONT_SIZE } from "./text-style";
import { GAME_WIDTH } from "../constants";

const HALF = 0.5;
const GLOW = { blur: 12, offset: 0 };
const WRAP_MARGIN = 40;

/** Text, color and vertical position of a centered label. */
export type CenteredTextOptions = Readonly<{
  color: string;
  size?: number;
  text: string;
  y: number;
}>;

/** Adds a glowing, centered heading. */
export const addHeading = (
  scene: Phaser.Scene,
  options: CenteredTextOptions,
): Phaser.GameObjects.Text =>
  scene.add
    .text(
      GAME_WIDTH * HALF,
      options.y,
      options.text,
      createTextStyle({
        align: "center",
        color: options.color,
        size: options.size ?? FONT_SIZE.large,
      }),
    )
    .setOrigin(HALF)
    .setShadow(GLOW.offset, GLOW.offset, options.color, GLOW.blur, false, true);

/** Adds a small, centered caption that wraps inside the screen. */
export const addCaption = (
  scene: Phaser.Scene,
  options: CenteredTextOptions,
): Phaser.GameObjects.Text =>
  scene.add
    .text(
      GAME_WIDTH * HALF,
      options.y,
      options.text,
      createTextStyle({
        align: "center",
        color: options.color,
        size: options.size ?? FONT_SIZE.small,
        wrapWidth: GAME_WIDTH - WRAP_MARGIN,
      }),
    )
    .setOrigin(HALF);

/** Adds an emoji icon at a position (emoji need a color font). */
export const addIcon = (
  scene: Phaser.Scene,
  position: Readonly<{ size: number; x: number; y: number }>,
  icon: string,
): Phaser.GameObjects.Text =>
  scene.add
    .text(position.x, position.y, icon, createIconStyle(position.size))
    .setOrigin(HALF);
