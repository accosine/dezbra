const HEX_RADIX = 16;
const CHANNEL_MAXIMUM = 255;
const CHANNEL_SHIFT = { blue: 1, green: 256, red: 65_536 };
const HEX_COLOR_PATTERN =
  /^#(?<red>[\da-f]{2})(?<green>[\da-f]{2})(?<blue>[\da-f]{2})$/iu;

/** RGB channels in the range 0–255. */
export type RgbColor = Readonly<{ blue: number; green: number; red: number }>;

const BLACK: RgbColor = Object.freeze({ blue: 0, green: 0, red: 0 });

/** Parses "#rrggbb"; invalid input yields black. */
export const parseHexColor = (hex: string): RgbColor => {
  const channels = HEX_COLOR_PATTERN.exec(hex)?.groups;

  if (channels === undefined) {
    return BLACK;
  }

  return {
    blue: Number.parseInt(channels.blue, HEX_RADIX),
    green: Number.parseInt(channels.green, HEX_RADIX),
    red: Number.parseInt(channels.red, HEX_RADIX),
  };
};

/** Packs RGB channels into the 0xRRGGBB number Phaser expects. */
export const rgbToNumber = (color: RgbColor): number =>
  color.red * CHANNEL_SHIFT.red +
  color.green * CHANNEL_SHIFT.green +
  color.blue * CHANNEL_SHIFT.blue;

/** Converts "#rrggbb" into the 0xRRGGBB number Phaser expects. */
export const hexToNumber = (hex: string): number =>
  rgbToNumber(parseHexColor(hex));

/** Brightens every channel of "#rrggbb" by the amount, capped at 255. */
export const lightenHex = (hex: string, amount: number): number => {
  const color = parseHexColor(hex);
  const brighten = (channel: number): number =>
    Math.min(CHANNEL_MAXIMUM, channel + amount);

  return rgbToNumber({
    blue: brighten(color.blue),
    green: brighten(color.green),
    red: brighten(color.red),
  });
};
