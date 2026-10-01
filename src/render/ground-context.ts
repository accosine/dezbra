import type { MapDefinition } from "../data/maps";
import type { Rect } from "../utils/collision";

/** What a ground renderer needs: the map, the visible world rectangle and the frame counter. */
export type GroundContext = Readonly<{
  frame: number;
  map: MapDefinition;
  view: Rect;
}>;
