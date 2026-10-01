import type * as Phaser from "phaser";
import { createTextStyle, FONT_SIZE } from "../ui/text-style";
import { addIcon } from "../ui/screen-text";
import { createCard } from "../ui/card";

/** Look and text of one choice card in an overlay. */
export type ChoiceCard = Readonly<{
  badge: Readonly<{ color: string; text: string }> | null;
  border: string;
  description: string;
  hint: string | null;
  icon: string;
  label: Readonly<{ color: string; text: string }> | null;
  name: string;
}>;

const CARD = {
  descriptionY: 44,
  fill: "#07070f",
  height: 118,
  hintY: 96,
  iconSize: 26,
  iconX: 30,
  labelY: 10,
  left: 10,
  nameY: 26,
  textX: 60,
  width: 410,
};
const BADGE = { right: 8, y: 6 };
const WRAP_WIDTH = 330;
const HALF = 0.5;
const RIGHT = 1;
const TOP = 0;

const createOptionalTexts = (
  scene: Phaser.Scene,
  choice: ChoiceCard,
): ReadonlyArray<Phaser.GameObjects.Text> => [
  ...(choice.label === null
    ? []
    : [
        scene.add.text(
          CARD.textX,
          CARD.labelY,
          choice.label.text,
          createTextStyle({ color: choice.label.color, size: FONT_SIZE.small }),
        ),
      ]),
  ...(choice.badge === null
    ? []
    : [
        scene.add
          .text(
            CARD.width - BADGE.right,
            BADGE.y,
            choice.badge.text,
            createTextStyle({
              color: choice.badge.color,
              size: FONT_SIZE.small,
            }),
          )
          .setOrigin(RIGHT, TOP),
      ]),
  ...(choice.hint === null
    ? []
    : [
        scene.add.text(
          CARD.textX,
          CARD.hintY,
          choice.hint,
          createTextStyle({ color: "#00d4ff", size: FONT_SIZE.small }),
        ),
      ]),
];

const createCardTexts = (
  scene: Phaser.Scene,
  choice: ChoiceCard,
): ReadonlyArray<Phaser.GameObjects.Text> => [
  addIcon(
    scene,
    { size: CARD.iconSize, x: CARD.iconX, y: CARD.height * HALF },
    choice.icon,
  ),
  scene.add.text(
    CARD.textX,
    CARD.nameY,
    choice.name,
    createTextStyle({
      color: "#ffffff",
      size: FONT_SIZE.medium,
      wrapWidth: WRAP_WIDTH,
    }),
  ),
  scene.add.text(
    CARD.textX,
    CARD.descriptionY,
    choice.description,
    createTextStyle({
      color: "#888888",
      size: FONT_SIZE.small,
      wrapWidth: WRAP_WIDTH,
    }),
  ),
  ...createOptionalTexts(scene, choice),
];

/** Adds a pressable choice card at the given vertical position. */
export const addChoiceCard = (
  scene: Phaser.Scene,
  choice: ChoiceCard,
  placement: Readonly<{ onPress: () => void; y: number }>,
): void => {
  const card = createCard(scene, {
    border: choice.border,
    fill: CARD.fill,
    glow: choice.border,
    height: CARD.height,
    onPress: placement.onPress,
    width: CARD.width,
    x: CARD.left,
    y: placement.y,
  });

  card.add([...createCardTexts(scene, choice)]);
};

/** Vertical position of the n-th card below the heading. */
export const placeChoiceCard = (index: number): number => {
  const firstCardY = 110;
  const gap = 12;

  return firstCardY + index * (CARD.height + gap);
};
