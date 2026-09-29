/** Character that marks a transparent pixel in {@link PixelSprite.rows}. */
export const TRANSPARENT_PIXEL = ".";

/** Pixel art encoded as rows of palette codes; each code maps to a "#rrggbb" color. */
export type PixelSprite = Readonly<{
  palette: ReadonlyArray<readonly [code: string, color: string]>;
  rows: ReadonlyArray<string>;
}>;
