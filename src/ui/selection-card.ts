import type * as Phaser from "phaser";
import { createTextStyle, FONT_SIZE } from "./text-style";
import { addIcon } from "./screen-text";
import { hexToNumber } from "../utils/color";

/** A colored label chip. */
export type Chip = Readonly<{ color: string; text: string }>;

/** Everything shown on a character or map card. */
export type SelectionContent = Readonly<{
  chips: ReadonlyArray<Chip>;
  description: string;
  detail: Chip | null;
  hint: string | null;
  icon: string;
  name: string;
  role: Chip;
}>;

const LAYOUT = {
  chipGap: 6,
  chipPaddingX: 4,
  chipPaddingY: 3,
  descriptionY: 38,
  detailY: 62,
  hintY: 90,
  iconSize: 28,
  iconX: 32,
  iconY: 48,
  lockOffset: 16,
  lockSize: 12,
  nameY: 8,
  roleY: 22,
  statsY: 76,
  textX: 64,
  wrapWidth: 330,
};
const CHIP_BORDER = 1;
const CHAR_WIDTH = 8;

const measureChipWidth = (chip: Chip): number =>
  chip.text.length * CHAR_WIDTH + LAYOUT.chipPaddingX + LAYOUT.chipPaddingX;

const createChip = (
  scene: Phaser.Scene,
  chip: Chip,
  position: Readonly<{ x: number; y: number }>,
): ReadonlyArray<Phaser.GameObjects.GameObject> => {
  const width = measureChipWidth(chip);
  const height = FONT_SIZE.small + LAYOUT.chipPaddingY + LAYOUT.chipPaddingY;
  const frame = scene.add.graphics();

  frame.lineStyle(CHIP_BORDER, hexToNumber(chip.color));
  frame.strokeRect(position.x, position.y, width, height);

  return [
    frame,
    scene.add.text(
      position.x + LAYOUT.chipPaddingX,
      position.y + LAYOUT.chipPaddingY,
      chip.text,
      createTextStyle({ color: chip.color, size: FONT_SIZE.small }),
    ),
  ];
};

const createChipRow = (
  scene: Phaser.Scene,
  chips: ReadonlyArray<Chip>,
  y: number,
): ReadonlyArray<Phaser.GameObjects.GameObject> =>
  chips.reduce<
    Readonly<{
      objects: ReadonlyArray<Phaser.GameObjects.GameObject>;
      x: number;
    }>
  >(
    (row, chip) => ({
      objects: [...row.objects, ...createChip(scene, chip, { x: row.x, y })],
      x: row.x + measureChipWidth(chip) + LAYOUT.chipGap,
    }),
    { objects: [], x: LAYOUT.textX },
  ).objects;

const createOptionalTexts = (
  scene: Phaser.Scene,
  content: SelectionContent,
): ReadonlyArray<Phaser.GameObjects.GameObject> => [
  ...(content.detail === null
    ? []
    : [
        scene.add.text(
          LAYOUT.textX,
          LAYOUT.detailY,
          content.detail.text,
          createTextStyle({
            color: content.detail.color,
            size: FONT_SIZE.small,
          }),
        ),
      ]),
  ...(content.hint === null
    ? []
    : [
        scene.add.text(
          LAYOUT.textX,
          LAYOUT.hintY,
          content.hint,
          createTextStyle({ color: "#888888", size: FONT_SIZE.small }),
        ),
        addIcon(
          scene,
          {
            size: LAYOUT.lockSize,
            x: LAYOUT.iconX + LAYOUT.lockOffset,
            y: LAYOUT.iconY + LAYOUT.lockOffset,
          },
          "🔒",
        ),
      ]),
];

/** Fills a card with icon, name, role chip, description, detail line, stat chips and lock hint. */
export const addSelectionContent = (
  scene: Phaser.Scene,
  card: Phaser.GameObjects.Container,
  content: SelectionContent,
): void => {
  card.add([
    addIcon(
      scene,
      { size: LAYOUT.iconSize, x: LAYOUT.iconX, y: LAYOUT.iconY },
      content.icon,
    ),
    scene.add.text(
      LAYOUT.textX,
      LAYOUT.nameY,
      content.name,
      createTextStyle({ color: "#ffffff", size: FONT_SIZE.medium }),
    ),
    ...createChip(scene, content.role, { x: LAYOUT.textX, y: LAYOUT.roleY }),
    scene.add.text(
      LAYOUT.textX,
      LAYOUT.descriptionY,
      content.description,
      createTextStyle({
        color: "#888888",
        size: FONT_SIZE.small,
        wrapWidth: LAYOUT.wrapWidth,
      }),
    ),
    ...createChipRow(scene, content.chips, LAYOUT.statsY),
    ...createOptionalTexts(scene, content),
  ]);
};
