import type * as Phaser from "phaser";
import { drawCemeteryGround, drawWastelandGround } from "./ground-wild";
import { drawCityGround, drawIndustrialGround } from "./ground-urban";
import { fillBoxes } from "./paint";
import type { GroundContext } from "./ground-context";
import type { MapId } from "../data/maps";

type GroundPainter = (
  graphics: Phaser.GameObjects.Graphics,
  context: GroundContext,
) => void;

const GROUND_PAINTERS: Readonly<Record<MapId, GroundPainter>> = {
  cemetery: drawCemeteryGround,
  city: drawCityGround,
  industrial: drawIndustrialGround,
  wasteland: drawWastelandGround,
};
const ORIGIN = 0;

/** Redraws the camera-relative ground of the map (screen coordinates). */
export const drawGround = (
  graphics: Phaser.GameObjects.Graphics,
  context: GroundContext,
): void => {
  graphics.clear();
  fillBoxes(graphics, { color: context.map.groundColor }, [
    {
      height: context.view.height,
      width: context.view.width,
      x: ORIGIN,
      y: ORIGIN,
    },
  ]);
  GROUND_PAINTERS[context.map.id](graphics, context);
};
