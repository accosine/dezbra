import type * as Phaser from "phaser";
import { type DecorShape, VARIANT_COLOR } from "../data/decor-shape";
import { fillRotatedEllipse } from "./ellipse-fill";
import { hexToNumber } from "../utils/color";

const OPAQUE = 1;

/** Global opacity and the color that replaces {@link VARIANT_COLOR}. */
export type ShapePaint = Readonly<{ alpha: number; variantColor: string }>;

const drawShape = (
  graphics: Phaser.GameObjects.Graphics,
  shape: DecorShape,
  paint: ShapePaint,
): void => {
  const color =
    shape.color === VARIANT_COLOR ? paint.variantColor : shape.color;

  graphics.fillStyle(hexToNumber(color), (shape.alpha ?? OPAQUE) * paint.alpha);

  if (shape.kind === "rect") {
    graphics.fillRect(shape.x, shape.y, shape.width, shape.height);
  } else if (shape.kind === "circle") {
    graphics.fillCircle(shape.x, shape.y, shape.radius);
  } else {
    fillRotatedEllipse(graphics, shape);
  }
};

/** Draws primitive shapes relative to the graphics' current origin. */
export const drawShapes = (
  graphics: Phaser.GameObjects.Graphics,
  shapes: ReadonlyArray<DecorShape>,
  paint: ShapePaint,
): void => {
  for (const shape of shapes) {
    drawShape(graphics, shape, paint);
  }
};

/** Draws shapes centered on a world point. */
export const drawShapesAt = (
  graphics: Phaser.GameObjects.Graphics,
  shapes: ReadonlyArray<DecorShape>,
  placement: Readonly<{
    alpha: number;
    variantColor?: string;
    x: number;
    y: number;
  }>,
): void => {
  graphics.save();
  graphics.translateCanvas(placement.x, placement.y);
  drawShapes(graphics, shapes, {
    alpha: placement.alpha,
    variantColor: VARIANT_COLOR,
  });
  graphics.restore();
};
