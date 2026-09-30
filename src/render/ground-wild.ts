import type * as Phaser from "phaser";
import { fillBoxes, listSteps, setFill, setStroke } from "./paint";
import { fillRotatedEllipse } from "./ellipse-fill";
import type { GroundContext } from "./ground-context";
import { listGridLines } from "./ground-grid";

const WILD_TUNING = {
  crackPhase: { branch: 2, main: 3, x: 31, y: 29 },
  cracks: {
    alpha: 0.6,
    branchLength: 18,
    color: "#060401",
    count: 10,
    length: 32,
    offset: 5,
    width: 1,
  },
  dunePhase: { scroll: 0.0007, x: 23, y: 19 },
  dunes: {
    alphaBase: 0.4,
    alphaSwing: 0.15,
    color: "#100a02",
    count: 14,
    radiusX: 42,
    radiusXStep: 6,
    radiusY: 11,
    radiusYStep: 2.5,
    rotation: 0.5,
  },
  fog: {
    alphaBase: 0.08,
    alphaSpeed: 0.02,
    alphaSwing: 0.04,
    color: "#08061e",
    count: 12,
    driftX: 0.55,
    driftY: 0.28,
    margin: 100,
    parallaxX: 0.35,
    parallaxY: 0.22,
    radiusX: 90,
    radiusXStep: 16,
    radiusY: 32,
    radiusYStep: 5,
    rotationStep: 0.25,
    spacingX: 148,
    spacingY: 118,
    verticalMargin: 70,
  },
  gridLine: {
    alpha: 0.6,
    color: "#161630",
    width: 1,
  },
  paths: {
    alpha: 0.5,
    color: "#100e1e",
    count: 4,
    width: 12,
  },
  scanlines: {
    alpha: 0.1,
    color: "#000000",
    height: 1,
    spacing: 3,
  },
  shimmer: {
    alphaBase: 0.06,
    alphaSwing: 0.02,
    color: "#160e04",
    speed: 0.04,
    top: 0.65,
  },
  tile: { color: "#0c0c1e", inset: 2, size: 68 },
};
const HALF = 0.5;
const DOUBLE = 2;
const ORIGIN = 0;
const STEP = 1;

const drawTiles = (
  graphics: Phaser.GameObjects.Graphics,
  context: GroundContext,
): void => {
  const { tile } = WILD_TUNING;
  const { columns, rows } = listGridLines(context.view, tile.size);
  const size = tile.size - tile.inset * DOUBLE;

  fillBoxes(
    graphics,
    tile,
    rows.flatMap((row) =>
      columns.map((column) => ({
        height: size,
        width: size,
        x: column + tile.inset,
        y: row + tile.inset,
      })),
    ),
  );
  setStroke(graphics, WILD_TUNING.gridLine, WILD_TUNING.gridLine.width);

  for (const row of rows) {
    graphics.lineBetween(ORIGIN, row, context.view.width, row);
  }

  for (const column of columns) {
    graphics.lineBetween(column, ORIGIN, column, context.view.height);
  }
};

const drawFog = (
  graphics: Phaser.GameObjects.Graphics,
  context: GroundContext,
): void => {
  const { fog } = WILD_TUNING;
  const { frame, view } = context;
  const wrapWidth = view.width + fog.margin * DOUBLE;

  for (let index = 0; index < fog.count; index += STEP) {
    const drift =
      (view.x * fog.parallaxX + index * fog.spacingX + frame * fog.driftX) %
      view.width;

    setFill(graphics, {
      alpha:
        fog.alphaBase +
        Math.sin(frame * fog.alphaSpeed + index) * fog.alphaSwing,
      color: fog.color,
    });
    fillRotatedEllipse(graphics, {
      radiusX: fog.radiusX + index * fog.radiusXStep,
      radiusY: fog.radiusY + index * fog.radiusYStep,
      rotation: index * fog.rotationStep,
      x: ((drift + view.width + fog.margin) % wrapWidth) - fog.margin,
      y:
        ((view.y * fog.parallaxY + index * fog.spacingY + frame * fog.driftY) %
          (view.height + fog.verticalMargin * DOUBLE)) -
        fog.verticalMargin,
    });
  }
};

/** Draws stone tiles, drifting fog and paths of the forgotten cemetery. */
export const drawCemeteryGround = (
  graphics: Phaser.GameObjects.Graphics,
  context: GroundContext,
): void => {
  const { paths } = WILD_TUNING;

  drawTiles(graphics, context);
  drawFog(graphics, context);
  fillBoxes(
    graphics,
    paths,
    listSteps(ORIGIN, paths.count, STEP).map((index) => ({
      height: context.view.height,
      width: paths.width,
      x: index * (context.view.width / paths.count),
      y: ORIGIN,
    })),
  );
};

const drawDunes = (
  graphics: Phaser.GameObjects.Graphics,
  context: GroundContext,
): void => {
  const { dunePhase, dunes } = WILD_TUNING;

  for (let index = 0; index < dunes.count; index += STEP) {
    setFill(graphics, {
      alpha: dunes.alphaBase + Math.sin(index) * dunes.alphaSwing,
      color: dunes.color,
    });
    fillRotatedEllipse(graphics, {
      radiusX: dunes.radiusX + index * dunes.radiusXStep,
      radiusY: dunes.radiusY + index * dunes.radiusYStep,
      rotation: Math.sin(index) * dunes.rotation,
      x:
        (Math.sin(index * dunePhase.x + context.view.x * dunePhase.scroll) *
          HALF +
          HALF) *
        context.view.width,
      y:
        (Math.cos(index * dunePhase.y + context.view.y * dunePhase.scroll) *
          HALF +
          HALF) *
        context.view.height,
    });
  }
};

const drawCracks = (
  graphics: Phaser.GameObjects.Graphics,
  context: GroundContext,
): void => {
  const { crackPhase, cracks } = WILD_TUNING;

  setStroke(graphics, cracks, cracks.width);

  for (let index = 0; index < cracks.count; index += STEP) {
    const x =
      (Math.cos(index * crackPhase.x) * HALF + HALF) * context.view.width;
    const y =
      (Math.sin(index * crackPhase.y) * HALF + HALF) * context.view.height;
    const branch = index * crackPhase.branch;
    const main = index * crackPhase.main;

    graphics.lineBetween(
      x,
      y,
      x + Math.sin(main) * cracks.length,
      y + Math.cos(main) * cracks.length,
    );
    graphics.lineBetween(
      x + cracks.offset,
      y + cracks.offset,
      x + Math.sin(branch) * cracks.branchLength,
      y + Math.cos(branch) * cracks.branchLength,
    );
  }
};

/** Draws sand grain, dune shadows, dry cracks and heat shimmer of the wasteland. */
export const drawWastelandGround = (
  graphics: Phaser.GameObjects.Graphics,
  context: GroundContext,
): void => {
  const { scanlines, shimmer } = WILD_TUNING;
  const { view } = context;

  fillBoxes(
    graphics,
    scanlines,
    listSteps(ORIGIN, view.height, scanlines.spacing).map((y) => ({
      height: scanlines.height,
      width: view.width,
      x: ORIGIN,
      y,
    })),
  );
  drawDunes(graphics, context);
  drawCracks(graphics, context);
  fillBoxes(
    graphics,
    {
      alpha:
        shimmer.alphaBase +
        Math.sin(context.frame * shimmer.speed) * shimmer.alphaSwing,
      color: shimmer.color,
    },
    [
      {
        height: view.height * (STEP - shimmer.top),
        width: view.width,
        x: ORIGIN,
        y: view.height * shimmer.top,
      },
    ],
  );
};
