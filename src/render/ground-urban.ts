import type * as Phaser from "phaser";
import {
  createHorizontalDashes,
  listGridLines,
  type Segment,
  transposeSegments,
} from "./ground-grid";
import { fillBoxes, listSteps, type Paint, setFill, setStroke } from "./paint";
import { fillRotatedEllipse } from "./ellipse-fill";
import type { GroundContext } from "./ground-context";

const URBAN_TUNING = {
  blockInset: 18,
  crosswalk: {
    alpha: 0.7,
    color: "#1e261e",
    length: 22,
    offset: -2,
    spacing: 5,
    stripes: 4,
    thickness: 3,
  },
  hazard: {
    alpha: 0.5,
    color: "#503c00",
    dash: 12,
    gap: 12,
    width: 5,
  },
  oil: {
    alpha: 0.3,
    color: "#000000",
    count: 10,
    radiusX: 22,
    radiusXStep: 4,
    radiusY: 8,
    radiusYStep: 2,
    rotationStep: 0.3,
  },
  oilPhase: { scroll: 0.0005, x: 19, y: 17 },
  pipes: {
    alpha: 0.45,
    color: "#1e190a",
    count: 3,
    width: 6,
  },
  roadLine: { dash: 18, gap: 16, width: 2 },
};
const HALF = 0.5;
const ORIGIN = 0;
const DOUBLE = 2;
const STEP = 1;

const strokeSegments = (
  graphics: Phaser.GameObjects.Graphics,
  segments: ReadonlyArray<Segment>,
): void => {
  for (const segment of segments) {
    graphics.lineBetween(
      segment.fromX,
      segment.fromY,
      segment.toX,
      segment.toY,
    );
  }
};

const drawSidewalkBlocks = (
  graphics: Phaser.GameObjects.Graphics,
  context: GroundContext,
): void => {
  const { columns, rows } = listGridLines(context.view, context.map.blockSize);
  const size = context.map.blockSize - URBAN_TUNING.blockInset * DOUBLE;

  fillBoxes(
    graphics,
    { color: context.map.sidewalkColor },
    rows.flatMap((row) =>
      columns.map((column) => ({
        height: size,
        width: size,
        x: column + URBAN_TUNING.blockInset,
        y: row + URBAN_TUNING.blockInset,
      })),
    ),
  );
};

const drawGridDashes = (
  graphics: Phaser.GameObjects.Graphics,
  context: GroundContext,
  pattern: Readonly<{ dash: number; gap: number }>,
): void => {
  const { columns, rows } = listGridLines(context.view, context.map.blockSize);
  const horizontal = rows.flatMap((row) =>
    createHorizontalDashes(
      { length: context.view.width, offset: context.view.x, y: row },
      pattern,
    ),
  );
  const vertical = columns.flatMap((column) =>
    transposeSegments(
      createHorizontalDashes(
        { length: context.view.height, offset: context.view.y, y: column },
        pattern,
      ),
    ),
  );

  strokeSegments(graphics, [...horizontal, ...vertical]);
};

const drawCrosswalks = (
  graphics: Phaser.GameObjects.Graphics,
  context: GroundContext,
): void => {
  const { columns, rows } = listGridLines(context.view, context.map.blockSize);
  const walk = URBAN_TUNING.crosswalk;
  const stripes = listSteps(ORIGIN, walk.stripes * walk.spacing, walk.spacing);

  fillBoxes(
    graphics,
    walk,
    rows.flatMap((row) =>
      columns.flatMap((column) =>
        stripes.flatMap((offset) => [
          {
            height: walk.length,
            width: walk.thickness,
            x: column + offset,
            y: row + walk.offset,
          },
          {
            height: walk.thickness,
            width: walk.length,
            x: column + walk.offset,
            y: row + offset,
          },
        ]),
      ),
    ),
  );
};

/** Draws sidewalks, dashed road lines and crosswalks of the abandoned city. */
export const drawCityGround = (
  graphics: Phaser.GameObjects.Graphics,
  context: GroundContext,
): void => {
  drawSidewalkBlocks(graphics, context);
  setStroke(
    graphics,
    { color: context.map.roadLineColor },
    URBAN_TUNING.roadLine.width,
  );
  drawGridDashes(graphics, context, URBAN_TUNING.roadLine);
  drawCrosswalks(graphics, context);
};

const drawOilPuddles = (
  graphics: Phaser.GameObjects.Graphics,
  context: GroundContext,
): void => {
  const { oil, oilPhase } = URBAN_TUNING;
  const paint: Paint = oil;

  setFill(graphics, paint);

  for (let index = 0; index < oil.count; index += STEP) {
    fillRotatedEllipse(graphics, {
      radiusX: oil.radiusX + index * oil.radiusXStep,
      radiusY: oil.radiusY + index * oil.radiusYStep,
      rotation: index * oil.rotationStep,
      x:
        (Math.sin(index * oilPhase.x + context.view.x * oilPhase.scroll) *
          HALF +
          HALF) *
        context.view.width,
      y:
        (Math.cos(index * oilPhase.y + context.view.y * oilPhase.scroll) *
          HALF +
          HALF) *
        context.view.height,
    });
  }
};

const drawPipeTracks = (
  graphics: Phaser.GameObjects.Graphics,
  context: GroundContext,
): void => {
  const { pipes } = URBAN_TUNING;

  setStroke(graphics, pipes, pipes.width);

  for (let index = 1; index <= pipes.count; index += STEP) {
    const y = (index / (pipes.count + STEP)) * context.view.height;

    graphics.lineBetween(ORIGIN, y, context.view.width, y);
  }
};

/** Draws lots, hazard stripes, oil puddles and pipe tracks of the industrial zone. */
export const drawIndustrialGround = (
  graphics: Phaser.GameObjects.Graphics,
  context: GroundContext,
): void => {
  drawSidewalkBlocks(graphics, context);
  setStroke(graphics, URBAN_TUNING.hazard, URBAN_TUNING.hazard.width);
  drawGridDashes(graphics, context, URBAN_TUNING.hazard);
  drawOilPuddles(graphics, context);
  drawPipeTracks(graphics, context);
};
