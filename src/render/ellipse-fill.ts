import * as Phaser from "phaser";
import { createEllipsePoints, type EllipseSpec } from "./ellipse-points";

/** Fills a rotated ellipse with the current fill style. */
export const fillRotatedEllipse = (
  graphics: Phaser.GameObjects.Graphics,
  ellipse: EllipseSpec,
): void => {
  graphics.fillPoints(
    createEllipsePoints(ellipse).map(
      (point) => new Phaser.Math.Vector2(point.x, point.y),
    ),
    true,
  );
};
