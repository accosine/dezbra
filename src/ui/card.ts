import * as Phaser from "phaser";
import { hexToNumber } from "../utils/color";

/** Placement and look of a card; `x`/`y` is the top-left corner. */
export type CardOptions = Readonly<{
  border: string;
  fill: string;
  glow?: string;
  height: number;
  isDimmed?: boolean;
  onPress?: () => void;
  width: number;
  x: number;
  y: number;
}>;

const ORIGIN = 0;
const OPAQUE = 1;
const CARD_LAYOUT = {
  border: 3,
  dimmedAlpha: 0.45,
  glowAlpha: 0.35,
  glowWidth: 6,
};

const drawCard = (
  graphics: Phaser.GameObjects.Graphics,
  options: CardOptions,
): void => {
  if (options.glow !== undefined) {
    graphics.lineStyle(
      CARD_LAYOUT.glowWidth,
      hexToNumber(options.glow),
      CARD_LAYOUT.glowAlpha,
    );
    graphics.strokeRect(ORIGIN, ORIGIN, options.width, options.height);
  }

  graphics.fillStyle(hexToNumber(options.fill));
  graphics.fillRect(ORIGIN, ORIGIN, options.width, options.height);
  graphics.lineStyle(CARD_LAYOUT.border, hexToNumber(options.border));
  graphics.strokeRect(ORIGIN, ORIGIN, options.width, options.height);
};

/** Creates a bordered card container; add content with coordinates relative to its corner. */
export const createCard = (
  scene: Phaser.Scene,
  options: CardOptions,
): Phaser.GameObjects.Container => {
  const background = scene.add.graphics();
  const card = scene.add.container(options.x, options.y, [background]);

  drawCard(background, options);
  card.setAlpha(options.isDimmed === true ? CARD_LAYOUT.dimmedAlpha : OPAQUE);

  if (options.onPress !== undefined) {
    const { onPress } = options;

    card
      .setInteractive(
        new Phaser.Geom.Rectangle(
          ORIGIN,
          ORIGIN,
          options.width,
          options.height,
        ),
        (hitArea: Phaser.Geom.Rectangle, x: number, y: number): boolean =>
          hitArea.contains(x, y),
      )
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        onPress();
      });
  }

  return card;
};
