import type * as Phaser from "phaser";
import { type Box, fillBoxes, setStroke } from "./paint";
import type { Building, BuildingWindow } from "../sim/world";
import type { MapId } from "../data/maps";

const WINDOW = {
  frame: 0.42,
  glow: 3,
  maximum: 14,
  minimum: 4,
  reflection: 3,
  slack: 0.5,
};
const BLACK = "#000000";
const HALF = 0.5;
const NO_INSET = 0;
const EDGE = 1;
const DOUBLE = 2;

/** Screen box of one window inside its building. */
export const measureWindow = (
  building: Building,
  window: BuildingWindow,
): Box => {
  const cellWidth = building.width / (building.windowColumns + WINDOW.slack);
  const cellHeight = building.height / (building.windowRows + WINDOW.slack);
  const size = Math.max(
    WINDOW.minimum,
    Math.min(
      Math.floor(cellWidth * WINDOW.frame),
      Math.floor(cellHeight * WINDOW.frame),
      WINDOW.maximum,
    ),
  );

  return {
    height: size,
    width: size,
    x: Math.floor(cellWidth * HALF + window.column * cellWidth),
    y: Math.floor(cellHeight * HALF + window.row * cellHeight),
  };
};

const crossOut = (
  graphics: Phaser.GameObjects.Graphics,
  box: Box,
  inset: number,
): void => {
  graphics.lineBetween(
    box.x + inset,
    box.y + inset,
    box.x + box.width - inset,
    box.y + box.height - inset,
  );
  graphics.lineBetween(
    box.x + box.width - inset,
    box.y + inset,
    box.x + inset,
    box.y + box.height - inset,
  );
};

const drawFrameCross = (
  graphics: Phaser.GameObjects.Graphics,
  box: Box,
  frame: Readonly<{ alpha: number; thickness: number }>,
): void => {
  const middle = Math.floor(box.width * HALF) - EDGE;

  fillBoxes(graphics, { alpha: frame.alpha, color: BLACK }, [
    { height: box.height, width: frame.thickness, x: box.x + middle, y: box.y },
    { height: frame.thickness, width: box.width, x: box.x, y: box.y + middle },
  ]);
};

const drawBoarded = (graphics: Phaser.GameObjects.Graphics, box: Box): void => {
  fillBoxes(graphics, { color: "#040408" }, [box]);
  setStroke(graphics, { alpha: 0.5, color: "#32230a" }, EDGE);
  crossOut(graphics, box, EDGE);
};

const drawBroken = (graphics: Phaser.GameObjects.Graphics, box: Box): void => {
  fillBoxes(graphics, { color: "#030306" }, [box]);
  setStroke(graphics, { color: "#1a1a22" }, EDGE);
  crossOut(graphics, box, NO_INSET);
};

const drawLit = (graphics: Phaser.GameObjects.Graphics, box: Box): void => {
  fillBoxes(graphics, { alpha: 0.12, color: "#ffc828" }, [
    {
      height: box.height + WINDOW.glow * DOUBLE,
      width: box.width + WINDOW.glow * DOUBLE,
      x: box.x - WINDOW.glow,
      y: box.y - WINDOW.glow,
    },
  ]);
  fillBoxes(graphics, { color: "#ffd840" }, [box]);
  drawFrameCross(graphics, box, { alpha: 0.35, thickness: DOUBLE });
  fillBoxes(graphics, { alpha: 0.4, color: "#ffffc8" }, [
    {
      height: WINDOW.reflection,
      width: WINDOW.reflection,
      x: box.x + EDGE,
      y: box.y + EDGE,
    },
  ]);
};

const drawDark = (graphics: Phaser.GameObjects.Graphics, box: Box): void => {
  fillBoxes(graphics, { color: "#07101e" }, [box]);
  fillBoxes(graphics, { alpha: 0.07, color: "#5078c8" }, [
    { ...box, width: WINDOW.reflection },
  ]);
  drawFrameCross(graphics, box, { alpha: 0.4, thickness: EDGE });
};

const pickWindowPainter = (
  mapId: MapId,
  window: BuildingWindow,
): ((graphics: Phaser.GameObjects.Graphics, box: Box) => void) => {
  if (mapId === "cemetery" || mapId === "wasteland") {
    return drawBoarded;
  }

  if (window.isBroken) {
    return drawBroken;
  }

  return window.isLit ? drawLit : drawDark;
};

/** Draws all windows: boarded on harsh maps, otherwise broken, lit or dark. */
export const drawWindows = (
  graphics: Phaser.GameObjects.Graphics,
  building: Building,
  mapId: MapId,
): void => {
  for (const window of building.windows) {
    pickWindowPainter(mapId, window)(graphics, measureWindow(building, window));
  }
};
