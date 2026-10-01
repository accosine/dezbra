import * as Phaser from "phaser";
import { BUTTON_COLORS, createButton } from "./button";
import { createIconStyle, createTextStyle, FONT_FAMILY } from "./text-style";
import { describe, expect, it, vi } from "vitest";
import { samplePixel, useHarnessScene } from "../harness/phaser-harness";
import { createCard } from "./card";
import { drawProgressBar } from "./progress-bar";

const BUTTON = { width: 200, x: 100, y: 50 };
const CARD = { height: 40, width: 100, x: 10, y: 20 };
const BAR = {
  background: "#000000",
  border: "#333333",
  height: 10,
  width: 100,
  x: 0,
  y: 0,
};
const DIMMED_ALPHA = 0.45;
const PRESS_OFFSET = 2;
const SIZE = 12;
const WRAP = 90;
const CHANNEL = { empty: 0, full: 255 };

const getScene = useHarnessScene();

describe("text styles", (): void => {
  it("uses the pixel font and optional wrapping", (): void => {
    expect(createTextStyle({ color: "#ffffff", size: SIZE })).toMatchObject({
      align: "left",
      fontFamily: FONT_FAMILY,
      fontSize: "12px",
    });
    expect(
      createTextStyle({
        align: "center",
        color: "#ffffff",
        size: SIZE,
        wrapWidth: WRAP,
      }).wordWrap,
    ).toEqual({
      useAdvancedWrap: true,
      width: WRAP,
    });
    expect(createIconStyle(SIZE)).toEqual({
      fontFamily: "sans-serif",
      fontSize: "12px",
    });
  });
});

describe("createButton", (): void => {
  it("shows its label and triggers on release", (): void => {
    const onPress = vi.fn<() => void>();
    const button = createButton(getScene(), {
      ...BUTTON,
      colors: BUTTON_COLORS.red,
      label: "▶ SPIELEN",
      onPress,
    });
    const label = button.list.find(
      (child) => child instanceof Phaser.GameObjects.Text,
    );

    button.emit(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN);
    expect(label).toMatchObject({
      text: "▶ SPIELEN",
      x: PRESS_OFFSET,
      y: PRESS_OFFSET,
    });
    button.emit(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT);
    expect(label).toMatchObject({ x: CHANNEL.empty, y: CHANNEL.empty });
    button.emit(Phaser.Input.Events.GAMEOBJECT_POINTER_UP);
    expect(onPress).toHaveBeenCalledOnce();
  });
});

describe("createCard", (): void => {
  it("reacts to presses when it has an action", (): void => {
    const onPress = vi.fn<() => void>();
    const card = createCard(getScene(), {
      ...CARD,
      border: "#df00ff",
      fill: "#06060e",
      glow: "#df00ff",
      onPress,
    });

    card.emit(Phaser.Input.Events.GAMEOBJECT_POINTER_UP);
    expect(onPress).toHaveBeenCalledOnce();
    expect(
      card.input?.hitAreaCallback?.(
        card.input.hitArea,
        CARD.width - SIZE,
        CARD.height - SIZE,
        card,
      ),
    ).toBe(true);
  });

  it("dims locked cards and ignores input without an action", (): void => {
    const card = createCard(getScene(), {
      ...CARD,
      border: "#1e1e2a",
      fill: "#06060e",
      isDimmed: true,
    });

    expect(card.alpha).toBe(DIMMED_ALPHA);
    expect(card.input).toBeNull();
  });
});

describe("drawProgressBar", (): void => {
  it("fills the bar up to the ratio", (): void => {
    const graphics = getScene().add.graphics();

    drawProgressBar(graphics, BAR, { color: "#ff0000", ratio: 0.5 });

    expect(samplePixel(graphics, BAR, { x: 25, y: 5 }).red).toBe(CHANNEL.full);
    expect(samplePixel(graphics, BAR, { x: 75, y: 5 }).red).toBe(CHANNEL.empty);
  });
});
