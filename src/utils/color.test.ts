import { describe, expect, it } from "vitest";
import { hexToNumber, lightenHex, parseHexColor, rgbToNumber } from "./color";

const EXPECTED = {
  gold: 16_766_720,
  lightened: 11_741_439,
  packed: 66_051,
};
const LIGHTEN_AMOUNT = 40;

describe("color", (): void => {
  it("parses hex colors into channels", (): void => {
    expect(parseHexColor("#8B0010")).toEqual({ blue: 16, green: 0, red: 139 });
  });

  it("falls back to black for invalid input", (): void => {
    expect(parseHexColor("red")).toEqual({ blue: 0, green: 0, red: 0 });
  });

  it("packs channels into a Phaser color number", (): void => {
    expect(rgbToNumber({ blue: 3, green: 2, red: 1 })).toBe(EXPECTED.packed);
    expect(hexToNumber("#ffd700")).toBe(EXPECTED.gold);
  });

  it("lightens every channel and caps at the maximum", (): void => {
    expect(lightenHex("#8b00f0", LIGHTEN_AMOUNT)).toBe(EXPECTED.lightened);
  });
});
