import { describe, expect, it } from "vitest";
import { MAP_IDS, MAPS } from "../data/maps";
import { samplePixel, useHarnessScene } from "../harness/phaser-harness";
import type { Building } from "../sim/world";
import { drawBuilding } from "./building-renderer";
import { hexToNumber } from "../utils/color";
import { measureWindow } from "./building-windows";

const getScene = useHarnessScene();
const MARGIN = 12;
const CANVAS = { height: 124, width: 124 };
const OPAQUE = 255;
const PROBE = {
  body: { x: 50, y: 90 },
  inset: 2,
  small: { size: 20, spot: 10 },
};
const HEX = { padding: 2, radix: 16 };
const BUILDING: Building = {
  height: 100,
  isDamaged: true,
  paletteIndex: 0,
  width: 100,
  windowColumns: 3,
  windowRows: 2,
  windows: [
    { column: 0, isBroken: false, isLit: true, row: 0 },
    { column: 1, isBroken: true, isLit: false, row: 0 },
    { column: 2, isBroken: false, isLit: false, row: 0 },
  ],
  x: 0,
  y: 0,
};

const toColorNumber = (
  color: Readonly<{ blue: number; green: number; red: number }>,
): number =>
  hexToNumber(
    `#${[color.red, color.green, color.blue].map((channel) => channel.toString(HEX.radix).padStart(HEX.padding, "0")).join("")}`,
  );

const drawAt = (
  building: Building,
  mapId: (typeof MAP_IDS)[number],
): Phaser.GameObjects.Graphics => {
  const graphics = getScene().add.graphics();

  graphics.translateCanvas(MARGIN, MARGIN);
  drawBuilding(graphics, building, MAPS[mapId]);

  return graphics;
};

describe("measureWindow", (): void => {
  it("spreads windows over the facade", (): void => {
    expect(
      measureWindow(BUILDING, {
        column: 1,
        isBroken: false,
        isLit: false,
        row: 1,
      }),
    ).toEqual({
      height: 12,
      width: 12,
      x: 42,
      y: 60,
    });
  });
});

describe("drawBuilding", (): void => {
  it.each(MAP_IDS)("draws an opaque %s building", (mapId): void => {
    const graphics = drawAt(BUILDING, mapId);

    expect(
      samplePixel(graphics, CANVAS, {
        x: MARGIN + PROBE.body.x,
        y: MARGIN + PROBE.body.y,
      }).alpha,
    ).toBe(OPAQUE);
  });

  it("lights city windows in yellow", (): void => {
    const graphics = drawAt(BUILDING, "city");
    const window = measureWindow(BUILDING, {
      column: 0,
      isBroken: false,
      isLit: true,
      row: 0,
    });
    const pixel = samplePixel(graphics, CANVAS, {
      x: MARGIN + window.x + window.width - PROBE.inset,
      y: MARGIN + window.y + window.height - PROBE.inset,
    });

    expect(toColorNumber(pixel)).toBe(hexToNumber("#ffd840"));
  });
});

describe("drawBuilding details", (): void => {
  it("skips graffiti on intact city buildings", (): void => {
    const intact = { ...BUILDING, isDamaged: false };

    expect(
      samplePixel(drawAt(intact, "city"), CANVAS, {
        x: MARGIN + PROBE.body.x,
        y: MARGIN + PROBE.body.y,
      }).alpha,
    ).toBe(OPAQUE);
  });

  it("skips damage details on small and intact buildings", (): void => {
    const small = {
      ...BUILDING,
      height: PROBE.small.size,
      isDamaged: false,
      width: PROBE.small.size,
      windows: [],
    };

    expect(
      samplePixel(drawAt(small, "industrial"), CANVAS, {
        x: MARGIN + PROBE.small.spot,
        y: MARGIN + PROBE.small.spot,
      }).alpha,
    ).toBe(OPAQUE);
  });
});
