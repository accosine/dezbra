import type * as Phaser from "phaser";
import type { Building, World } from "../sim/world";
import { countDecorVariants, getDecorOrigin } from "./decor-texture";
import { getDecorTextureKey, TEXTURE_KEYS } from "./texture-keys";
import { isRectInView, type Rect } from "../utils/collision";
import { type MapDefinition, type MapId } from "../data/maps";
import { DEPTHS } from "./depths";
import { drawBuilding } from "./building-renderer";
import { drawGround } from "./ground-renderer";
import { hexToNumber } from "../utils/color";

/** Phaser objects that show the static world of a run. */
export type WorldView = Readonly<{
  buildings: ReadonlyArray<
    Readonly<{ building: Building; graphics: Phaser.GameObjects.Graphics }>
  >;
  ground: Phaser.GameObjects.Graphics;
  map: MapDefinition;
}>;

const WORLD_VIEW = { cullMargin: 16, stainAlpha: 0.9 };
const OVERLAYS: Readonly<Partial<Record<MapId, string>>> = {
  cemetery: TEXTURE_KEYS.mist,
  wasteland: TEXTURE_KEYS.glare,
};
const FIXED = 0;
const ORIGIN = 0;

const addStains = (
  scene: Phaser.Scene,
  world: World,
  map: MapDefinition,
): void => {
  for (const stain of world.stains) {
    scene.add
      .image(stain.x, stain.y, TEXTURE_KEYS.stain)
      .setDisplaySize(
        stain.radiusX + stain.radiusX,
        stain.radiusY + stain.radiusY,
      )
      .setTint(hexToNumber(map.stainColor))
      .setAlpha(stain.alpha * WORLD_VIEW.stainAlpha)
      .setDepth(DEPTHS.stains);
  }
};

const addDecorations = (scene: Phaser.Scene, world: World): void => {
  for (const decoration of world.decorations) {
    const origin = getDecorOrigin(decoration.type);
    const variant = decoration.variant % countDecorVariants(decoration.type);

    scene.add
      .image(
        decoration.x,
        decoration.y,
        getDecorTextureKey(decoration.type, variant),
      )
      .setOrigin(origin.x, origin.y)
      .setAngle(decoration.rotation)
      .setDepth(DEPTHS.decorations);
  }
};

const addOverlay = (scene: Phaser.Scene, map: MapDefinition): void => {
  const key = OVERLAYS[map.id];

  if (key !== undefined) {
    scene.add
      .image(ORIGIN, ORIGIN, key)
      .setOrigin(ORIGIN)
      .setScrollFactor(FIXED)
      .setDepth(DEPTHS.overlay);
  }
};

/** Creates ground, stains, buildings, decorations and the map overlay. */
export const createWorldView = (
  scene: Phaser.Scene,
  world: World,
  map: MapDefinition,
): WorldView => {
  const ground = scene.add
    .graphics()
    .setScrollFactor(FIXED)
    .setDepth(DEPTHS.ground);
  const buildings = world.buildings.map((building) => {
    const graphics = scene.add
      .graphics({ x: building.x, y: building.y })
      .setDepth(DEPTHS.buildings);

    drawBuilding(graphics, building, map);

    return { building, graphics };
  });

  addStains(scene, world, map);
  addDecorations(scene, world);
  addOverlay(scene, map);

  return { buildings, ground, map };
};

/** Redraws the ground for the visible area and hides buildings outside of it. */
export const updateWorldView = (
  view: WorldView,
  context: Readonly<{ frame: number; visible: Rect }>,
): void => {
  drawGround(view.ground, {
    frame: context.frame,
    map: view.map,
    view: context.visible,
  });

  for (const entry of view.buildings) {
    entry.graphics.setVisible(
      isRectInView(entry.building, context.visible, WORLD_VIEW.cullMargin),
    );
  }
};
