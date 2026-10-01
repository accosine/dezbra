import { describe, expect, it } from "vitest";
import { generateWorld } from "./world-generation";
import { MAPS } from "../data/maps";
import type { World } from "./world";

const SAMPLE_DECORATION_INDEX = 5;
const SAMPLE_STAIN_INDEX = 3;
const FIRST_INDEX = 0;
const CENTER_DIVISOR = 2;

/** Reference values produced by running the original game's generator. */
const REFERENCE = [
  {
    broken: 622,
    buildings: 521,
    decoration: {
      rotation: 270,
      type: "car",
      variant: 0,
      x: 634.718,
      y: 95.209,
    },
    decorations: 373,
    firstBuilding: { height: 64.5, isDamaged: true, width: 64.5, x: 31, y: 31 },
    lit: 398,
    map: MAPS.city,
    stain: {
      alpha: 0.324,
      radiusX: 22.834,
      radiusY: 16.756,
      x: 361.715,
      y: 1784.444,
    },
    windows: 4310,
  },
  {
    broken: 1838,
    buildings: 324,
    decoration: {
      rotation: 270,
      type: "pipe",
      variant: 0,
      x: 1309.532,
      y: 213.849,
    },
    decorations: 257,
    firstBuilding: {
      height: 104.5,
      isDamaged: false,
      width: 104.5,
      x: 31,
      y: 31,
    },
    lit: 918,
    map: MAPS.industrial,
    stain: {
      alpha: 0.259,
      radiusX: 20.446,
      radiusY: 8.924,
      x: 3160.297,
      y: 1730.036,
    },
    windows: 9959,
  },
  {
    broken: 4201,
    buildings: 562,
    decoration: {
      rotation: 90,
      type: "grave",
      variant: 0,
      x: 524.621,
      y: 156.415,
    },
    decorations: 416,
    firstBuilding: { height: 84.5, isDamaged: true, width: 84.5, x: 31, y: 31 },
    lit: 905,
    map: MAPS.cemetery,
    stain: {
      alpha: 0.123,
      radiusX: 11.521,
      radiusY: 18.703,
      x: 2705.1,
      y: 3025.52,
    },
    windows: 10_168,
  },
  {
    broken: 8587,
    buildings: 453,
    decoration: {
      rotation: 180,
      type: "wreck",
      variant: 2,
      x: 795.749,
      y: 147.984,
    },
    decorations: 344,
    firstBuilding: {
      height: 124.5,
      isDamaged: false,
      width: 124.5,
      x: 31,
      y: 31,
    },
    lit: 1761,
    map: MAPS.wasteland,
    stain: {
      alpha: 0.129,
      radiusX: 15.67,
      radiusY: 8.261,
      x: 1344.5,
      y: 1252.701,
    },
    windows: 19_403,
  },
];

const countWindows = (
  world: World,
  predicate: (
    window: Readonly<{ isBroken: boolean; isLit: boolean }>,
  ) => boolean,
): number =>
  world.buildings.reduce(
    (sum, building) =>
      sum + building.windows.filter((window) => predicate(window)).length,
    FIRST_INDEX,
  );

type Reference = (typeof REFERENCE)[number];

const expectSamplesMatch = (world: World, reference: Reference): void => {
  const decoration = world.decorations.at(SAMPLE_DECORATION_INDEX);
  const stain = world.stains.at(SAMPLE_STAIN_INDEX);

  expect(decoration).toMatchObject({
    rotation: reference.decoration.rotation,
    type: reference.decoration.type,
    variant: reference.decoration.variant,
  });
  expect(decoration?.x).toBeCloseTo(reference.decoration.x);
  expect(decoration?.y).toBeCloseTo(reference.decoration.y);
  expect(stain?.x).toBeCloseTo(reference.stain.x);
  expect(stain?.radiusY).toBeCloseTo(reference.stain.radiusY);
  expect(stain?.alpha).toBeCloseTo(reference.stain.alpha);
};

const isCoveringPoint = (world: World, point: number): boolean =>
  world.buildings.some(
    (building) =>
      building.x < point &&
      building.x + building.width > point &&
      building.y < point &&
      building.y + building.height > point,
  );

describe("generateWorld layout", (): void => {
  it.each(REFERENCE)(
    "recreates the original $map.id layout",
    (reference): void => {
      const world = generateWorld(reference.map);

      expect(world.buildings).toHaveLength(reference.buildings);
      expect(world.decorations).toHaveLength(reference.decorations);
      expect(world.stains).toHaveLength(reference.map.stainCount);
      expect(world.buildings.at(FIRST_INDEX)).toMatchObject(
        reference.firstBuilding,
      );
      expect(countWindows(world, () => true)).toBe(reference.windows);
      expect(countWindows(world, (window) => window.isLit)).toBe(reference.lit);
      expect(countWindows(world, (window) => window.isBroken)).toBe(
        reference.broken,
      );
    },
  );
});

describe("generateWorld details", (): void => {
  it.each(REFERENCE)(
    "places $map.id decorations and stains like the original",
    (reference): void => {
      expectSamplesMatch(generateWorld(reference.map), reference);
    },
  );

  it("falls back to barrels when a map lists no decoration types", (): void => {
    const world = generateWorld({ ...MAPS.city, decorTypes: [] });

    expect(
      new Set(world.decorations.map((decoration) => decoration.type)),
    ).toEqual(new Set(["barrel"]));
  });

  it("keeps the spawn area in the center free of buildings", (): void => {
    const map = MAPS.city;

    expect(
      isCoveringPoint(generateWorld(map), map.worldSize / CENTER_DIVISOR),
    ).toBe(false);
  });
});
