import type * as Phaser from "phaser";
import { fillBoxes, setStroke } from "./paint";
import type { Building } from "../sim/world";
import { drawWindows } from "./building-windows";
import type { MapDefinition } from "../data/maps";
import { WALL_PAINTERS } from "./building-walls";

const BUILDING = {
  chimney: {
    color: "#181410",
    height: 9,
    minimumWidth: 40,
    position: 0.65,
    width: 8,
  },
  crack: [
    { x: 0.28, y: 0.04 },
    { x: 0.36, y: 0.45 },
    { x: 0.32, y: 0.88 },
  ],
  roof: { height: 5, overhang: 2, top: -3 },
  shadowOffset: 5,
  sideShade: 4,
  topHighlight: 3,
};
const BLACK = "#000000";
const ORIGIN = 0;
const EDGE = 1;
const DOUBLE = 2;

const drawShell = (
  graphics: Phaser.GameObjects.Graphics,
  building: Building,
  map: MapDefinition,
): void => {
  const palette = map.wallPalettes[building.paletteIndex];

  fillBoxes(graphics, { alpha: 0.5, color: BLACK }, [
    {
      height: building.height,
      width: building.width,
      x: BUILDING.shadowOffset,
      y: BUILDING.shadowOffset,
    },
  ]);
  fillBoxes(graphics, { color: palette.base }, [
    { height: building.height, width: building.width, x: ORIGIN, y: ORIGIN },
  ]);
  WALL_PAINTERS[map.id](graphics, building);
  fillBoxes(graphics, { color: palette.highlight }, [
    {
      height: BUILDING.topHighlight,
      width: building.width,
      x: ORIGIN,
      y: ORIGIN,
    },
  ]);
  fillBoxes(graphics, { alpha: 0.32, color: BLACK }, [
    {
      height: building.height,
      width: BUILDING.sideShade,
      x: building.width - BUILDING.sideShade,
      y: ORIGIN,
    },
  ]);
  fillBoxes(graphics, { alpha: 0.2, color: BLACK }, [
    {
      height: BUILDING.topHighlight,
      width: building.width,
      x: ORIGIN,
      y: building.height - BUILDING.topHighlight,
    },
  ]);
};

const drawRoof = (
  graphics: Phaser.GameObjects.Graphics,
  building: Building,
  map: MapDefinition,
): void => {
  const { chimney, roof } = BUILDING;

  fillBoxes(graphics, { color: map.roofColors[building.paletteIndex] }, [
    {
      height: roof.height,
      width: building.width + roof.overhang * DOUBLE,
      x: -roof.overhang,
      y: roof.top,
    },
  ]);

  if (map.id === "industrial" && building.width > chimney.minimumWidth) {
    fillBoxes(graphics, { color: chimney.color }, [
      {
        height: chimney.height,
        width: chimney.width,
        x: Math.floor(building.width * chimney.position),
        y: -chimney.height,
      },
    ]);
  }
};

const drawCrack = (
  graphics: Phaser.GameObjects.Graphics,
  building: Building,
  map: MapDefinition,
): void => {
  if (!building.isDamaged || map.id === "wasteland") {
    return;
  }

  const points = BUILDING.crack.map((point) => ({
    x: Math.floor(building.width * point.x),
    y: Math.floor(building.height * point.y),
  }));

  setStroke(graphics, { alpha: 0.45, color: BLACK }, EDGE);
  for (const [index, point] of points.slice(EDGE).entries()) {
    const previous = points[index];

    graphics.lineBetween(previous.x, previous.y, point.x, point.y);
  }
};

/** Draws a building at the graphics' origin (its top-left corner). */
export const drawBuilding = (
  graphics: Phaser.GameObjects.Graphics,
  building: Building,
  map: MapDefinition,
): void => {
  drawShell(graphics, building, map);
  drawWindows(graphics, building, map.id);
  drawRoof(graphics, building, map);
  drawCrack(graphics, building, map);
};
