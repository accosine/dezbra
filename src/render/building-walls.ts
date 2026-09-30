import type * as Phaser from "phaser";
import { type Box, fillBoxes, listSteps } from "./paint";
import type { Building } from "../sim/world";
import type { MapId } from "../data/maps";

type WallPainter = (
  graphics: Phaser.GameObjects.Graphics,
  building: Building,
) => void;

const BLACK = "#000000";
const ORIGIN = 0;
const EDGE = 1;
const DOUBLE = 2;
const WALLS = {
  cemetery: {
    brickSpacing: 12,
    lineSpacing: 4,
    moss: 10,
    mossSideHeight: 0.5,
    mossSideTop: 0.25,
    mossSideWidth: 6,
    stainStart: 0.6,
  },
  city: {
    brickSpacing: 8,
    graffitiHeight: 0.25,
    graffitiMinWidth: 30,
    graffitiTop: 0.4,
    graffitiWidth: 0.4,
    inset: 4,
    lineSpacing: 5,
  },
  industrial: {
    band: 10,
    bandMinHeight: 30,
    bandStripe: 5,
    beam: 4,
    beamInset: 2,
    lineSpacing: 3,
    rust: 4,
    rustLength: 0.4,
    rustLengthStep: 5,
    rustStart: 0.15,
    rustStep: 0.2,
    rustWidth: 3,
  },
  wasteland: {
    drift: 8,
    lineSpacing: 3,
    rust: 3,
    rustLength: 0.3,
    rustLengthStep: 8,
    rustStart: 0.08,
    rustStep: 0.32,
    rustTop: 0.06,
    rustWidth: 0.2,
  },
};

const listHorizontalLines = (
  building: Building,
  spacing: number,
  inset: number,
): ReadonlyArray<Box> =>
  listSteps(spacing, building.height, spacing).map((y) => ({
    height: EDGE,
    width: building.width - inset * DOUBLE,
    x: inset,
    y,
  }));

const listVerticalLines = (
  building: Building,
  spacing: number,
): ReadonlyArray<Box> =>
  listSteps(spacing, building.width, spacing).map((x) => ({
    height: building.height - DOUBLE - EDGE,
    width: EDGE,
    x,
    y: DOUBLE,
  }));

const paintCityWall: WallPainter = (graphics, building) => {
  const { city } = WALLS;

  fillBoxes(graphics, { alpha: 0.1, color: BLACK }, [
    ...listHorizontalLines(building, city.lineSpacing, EDGE),
    ...listVerticalLines(building, city.brickSpacing),
  ]);

  if (building.isDamaged && building.width > city.graffitiMinWidth) {
    fillBoxes(graphics, { alpha: 0.12, color: "#b40050" }, [
      {
        height: Math.floor(building.height * city.graffitiHeight),
        width: Math.floor(building.width * city.graffitiWidth),
        x: city.inset,
        y: Math.floor(building.height * city.graffitiTop),
      },
    ]);
  }
};

const paintWarningBand: WallPainter = (graphics, building) => {
  const { industrial } = WALLS;

  if (building.height <= industrial.bandMinHeight) {
    return;
  }

  const top = building.height - industrial.band;

  fillBoxes(graphics, { alpha: 0.3, color: "#3c3200" }, [
    { height: industrial.band, width: building.width, x: ORIGIN, y: top },
  ]);
  fillBoxes(
    graphics,
    { alpha: 0.2, color: "#504600" },
    listSteps(ORIGIN, building.width, industrial.band).map((x) => ({
      height: industrial.band,
      width: industrial.bandStripe,
      x,
      y: top,
    })),
  );
};

const paintIndustrialWall: WallPainter = (graphics, building) => {
  const { industrial } = WALLS;
  const rustStreaks = listSteps(ORIGIN, industrial.rust, EDGE).map((index) => ({
    height: Math.floor(
      building.height * industrial.rustLength +
        index * industrial.rustLengthStep,
    ),
    width: industrial.rustWidth,
    x: Math.floor(
      building.width * (industrial.rustStart + index * industrial.rustStep),
    ),
    y: ORIGIN,
  }));

  fillBoxes(
    graphics,
    { alpha: 0.14, color: BLACK },
    listHorizontalLines(building, industrial.lineSpacing, EDGE),
  );
  fillBoxes(graphics, { alpha: 0.2, color: BLACK }, [
    {
      height: building.height,
      width: industrial.beam,
      x: industrial.beamInset,
      y: ORIGIN,
    },
    {
      height: building.height,
      width: industrial.beam,
      x: building.width - industrial.beam - industrial.beamInset,
      y: ORIGIN,
    },
  ]);
  fillBoxes(graphics, { alpha: 0.22, color: "#501e00" }, rustStreaks);

  paintWarningBand(graphics, building);
};

const paintCemeteryWall: WallPainter = (graphics, building) => {
  const { cemetery } = WALLS;

  fillBoxes(
    graphics,
    { alpha: 0.025, color: "#ffffff" },
    listHorizontalLines(building, cemetery.lineSpacing, DOUBLE),
  );
  fillBoxes(
    graphics,
    { alpha: 0.2, color: BLACK },
    listVerticalLines(building, cemetery.brickSpacing),
  );
  fillBoxes(graphics, { alpha: 0.55, color: "#0a280a" }, [
    {
      height: cemetery.moss,
      width: building.width,
      x: ORIGIN,
      y: building.height - cemetery.moss,
    },
    {
      height: Math.floor(building.height * cemetery.mossSideHeight),
      width: cemetery.mossSideWidth,
      x: ORIGIN,
      y: Math.floor(building.height * cemetery.mossSideTop),
    },
  ]);
  fillBoxes(graphics, { alpha: 0.12, color: BLACK }, [
    {
      height: building.height,
      width: building.width * (EDGE - cemetery.stainStart),
      x: building.width * cemetery.stainStart,
      y: ORIGIN,
    },
  ]);
};

const paintWastelandWall: WallPainter = (graphics, building) => {
  const { wasteland } = WALLS;

  fillBoxes(
    graphics,
    { alpha: 0.16, color: BLACK },
    listHorizontalLines(building, wasteland.lineSpacing, EDGE),
  );
  fillBoxes(
    graphics,
    { alpha: 0.28, color: "#5a2300" },
    listSteps(ORIGIN, wasteland.rust, EDGE).map((index) => ({
      height: Math.floor(
        building.height * wasteland.rustLength +
          index * wasteland.rustLengthStep,
      ),
      width: Math.floor(building.width * wasteland.rustWidth),
      x: Math.floor(
        building.width * (wasteland.rustStart + index * wasteland.rustStep),
      ),
      y: Math.floor(building.height * wasteland.rustTop),
    })),
  );
  fillBoxes(graphics, { alpha: 0.4, color: "#140f05" }, [
    {
      height: wasteland.drift,
      width: building.width,
      x: ORIGIN,
      y: building.height - wasteland.drift,
    },
  ]);
};

/** Surface textures of building walls per map. */
export const WALL_PAINTERS: Readonly<Record<MapId, WallPainter>> = {
  cemetery: paintCemeteryWall,
  city: paintCityWall,
  industrial: paintIndustrialWall,
  wasteland: paintWastelandWall,
};
