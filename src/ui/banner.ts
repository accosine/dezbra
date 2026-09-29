import type * as Phaser from "phaser";
import { createTextStyle, FONT_SIZE } from "./text-style";
import { GAME_HEIGHT, GAME_WIDTH } from "../constants";

const BANNER_LAYOUT = {
  depth: 100,
  fadeDelay: 2000,
  fadeDuration: 300,
  hidden: 0,
  popDuration: 200,
  shadowOffset: 2,
  startScale: 0.6,
  strokeWidth: 4,
  wrapWidth: 400,
};
const HALF = 0.5;

/** Placement of a banner; `offsetY` shifts it from the screen center. */
export type BannerOptions = Readonly<{
  color: string;
  offsetY?: number;
  size?: number;
}>;

/** Shows a centered announcement that pops in, stays for about two seconds and fades out. */
export const showBanner = (
  scene: Phaser.Scene,
  text: string,
  options: BannerOptions,
): Phaser.GameObjects.Text => {
  const banner = scene.add
    .text(
      GAME_WIDTH * HALF,
      GAME_HEIGHT * HALF + (options.offsetY ?? BANNER_LAYOUT.hidden),
      text,
      createTextStyle({
        align: "center",
        color: options.color,
        size: options.size ?? FONT_SIZE.large,
        wrapWidth: BANNER_LAYOUT.wrapWidth,
      }),
    )
    .setOrigin(HALF)
    .setDepth(BANNER_LAYOUT.depth)
    .setStroke("#000000", BANNER_LAYOUT.strokeWidth)
    .setShadow(
      BANNER_LAYOUT.shadowOffset,
      BANNER_LAYOUT.shadowOffset,
      options.color,
      BANNER_LAYOUT.strokeWidth,
      true,
      true,
    );

  scene.tweens.add({
    duration: BANNER_LAYOUT.popDuration,
    ease: "Back.Out",
    scale: { from: BANNER_LAYOUT.startScale, to: 1 },
    targets: banner,
  });
  scene.tweens.add({
    alpha: BANNER_LAYOUT.hidden,
    delay: BANNER_LAYOUT.fadeDelay,
    duration: BANNER_LAYOUT.fadeDuration,
    targets: banner,
  });
  scene.time.delayedCall(
    BANNER_LAYOUT.fadeDelay + BANNER_LAYOUT.fadeDuration,
    (): void => {
      banner.destroy();
    },
  );

  return banner;
};
