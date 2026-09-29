import type * as Phaser from "phaser";

/** Pixel font of the game with a monospace fallback. */
export const FONT_FAMILY = '"Press Start 2P", monospace';

/** Font sizes in pixels; 8 px is the native size of the pixel font. */
export const FONT_SIZE = {
  huge: 28,
  large: 14,
  medium: 10,
  small: 8,
  title: 18,
};

/** Options for {@link createTextStyle}. */
export type TextStyleOptions = Readonly<{
  align?: "center" | "left" | "right";
  color: string;
  lineSpacing?: number;
  size: number;
  wrapWidth?: number;
}>;

/** Builds a Phaser text style in the game font. */
export const createTextStyle = (
  options: TextStyleOptions,
): Phaser.Types.GameObjects.Text.TextStyle => ({
  align: options.align ?? "left",
  color: options.color,
  fontFamily: FONT_FAMILY,
  fontSize: `${options.size}px`,
  ...(options.wrapWidth !== undefined && {
    wordWrap: { useAdvancedWrap: true, width: options.wrapWidth },
  }),
});

/** Builds a style for emoji icons, which need a color font instead of the pixel font. */
export const createIconStyle = (
  size: number,
): Phaser.Types.GameObjects.Text.TextStyle => ({
  fontFamily: "sans-serif",
  fontSize: `${size}px`,
});
