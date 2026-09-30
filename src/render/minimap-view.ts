import type * as Phaser from "phaser";
import { fillBoxes, setFill, setStroke } from "./paint";
import type { GameState } from "../sim/game-state";
import type { Rect } from "../utils/collision";
import type { Vector } from "../utils/vector";

/** Placement of the minimap (bottom right, above the weapon bar). */
export const MINIMAP_LAYOUT = {
  border: { color: "#2a2a3a", width: 2 },
  depth: 40,
  size: 70,
  x: 352,
  y: 577,
};

const MINIMAP = {
  background: "#080810",
  boss: { color: "#ff0000", size: 5 },
  chest: { color: "#ffd700", size: 5 },
  enemy: { big: 3, bigColor: "#ff6b6b", color: "#e74c3c", size: 2 },
  player: { color: "#4fc3f7", radius: 3 },
  tintAlpha: 0.4,
  viewport: { alpha: 0.2, color: "#ffffff" },
};
const MINIMUM_SIZE = 1;
const ORIGIN = 0;
const HALF = 0.5;

/** Converts a world rectangle into minimap coordinates. */
export const toMinimapRect = (rect: Rect, worldSize: number): Rect => {
  const scale = MINIMAP_LAYOUT.size / worldSize;

  return {
    height: Math.max(MINIMUM_SIZE, rect.height * scale),
    width: Math.max(MINIMUM_SIZE, rect.width * scale),
    x: rect.x * scale,
    y: rect.y * scale,
  };
};

const toMinimapPoint = (point: Vector, worldSize: number): Vector => ({
  x: (point.x / worldSize) * MINIMAP_LAYOUT.size,
  y: (point.y / worldSize) * MINIMAP_LAYOUT.size,
});

const markerBox = (point: Vector, worldSize: number, size: number): Rect => {
  const center = toMinimapPoint(point, worldSize);

  return {
    height: size,
    width: size,
    x: center.x - size * HALF,
    y: center.y - size * HALF,
  };
};

const bakeBase = (scene: Phaser.Scene, state: GameState): string => {
  const key = `minimap-${state.map.id}`;

  if (!scene.textures.exists(key)) {
    const graphics = scene.make.graphics({}, false);
    const full = {
      height: MINIMAP_LAYOUT.size,
      width: MINIMAP_LAYOUT.size,
      x: ORIGIN,
      y: ORIGIN,
    };

    fillBoxes(graphics, { color: MINIMAP.background }, [full]);
    fillBoxes(
      graphics,
      { alpha: MINIMAP.tintAlpha, color: state.map.minimapTint },
      [full],
    );
    fillBoxes(
      graphics,
      { color: state.map.minimapBuildingColor },
      state.world.buildings.map((building) =>
        toMinimapRect(building, state.map.worldSize),
      ),
    );
    graphics.generateTexture(key, MINIMAP_LAYOUT.size, MINIMAP_LAYOUT.size);
    graphics.destroy();
  }

  return key;
};

const drawEnemies = (
  graphics: Phaser.GameObjects.Graphics,
  state: GameState,
): void => {
  const { worldSize } = state.map;

  const spawned = state.enemies.filter(
    (candidate) => candidate.spawnTicks <= ORIGIN,
  );

  for (const enemy of spawned) {
    if (enemy.boss === null) {
      const size = MINIMAP.enemy[enemy.isBig ? "big" : "size"];

      fillBoxes(
        graphics,
        { color: MINIMAP.enemy[enemy.isBig ? "bigColor" : "color"] },
        [markerBox(enemy, worldSize, size)],
      );
    } else {
      fillBoxes(graphics, { color: MINIMAP.boss.color }, [
        markerBox(enemy, worldSize, MINIMAP.boss.size),
      ]);
    }
  }
};

/** Minimap with baked buildings plus live markers for enemies, chests, player and view. */
export class MinimapView {
  private readonly markers: Phaser.GameObjects.Graphics;

  public constructor(scene: Phaser.Scene, state: GameState) {
    scene.add
      .image(MINIMAP_LAYOUT.x, MINIMAP_LAYOUT.y, bakeBase(scene, state))
      .setOrigin(ORIGIN)
      .setDepth(MINIMAP_LAYOUT.depth);
    this.markers = scene.add
      .graphics({ x: MINIMAP_LAYOUT.x, y: MINIMAP_LAYOUT.y })
      .setDepth(MINIMAP_LAYOUT.depth);
  }

  private drawFrame(state: GameState, visible: Rect): void {
    const view = toMinimapRect(visible, state.map.worldSize);

    setStroke(this.markers, MINIMAP.viewport, MINIMUM_SIZE);
    this.markers.strokeRect(view.x, view.y, view.width, view.height);
    setStroke(
      this.markers,
      { color: MINIMAP_LAYOUT.border.color },
      MINIMAP_LAYOUT.border.width,
    );
    this.markers.strokeRect(
      ORIGIN,
      ORIGIN,
      MINIMAP_LAYOUT.size,
      MINIMAP_LAYOUT.size,
    );
  }

  /** Redraws the markers for the state and the visible world rectangle. */
  public update(state: GameState, visible: Rect): void {
    const { worldSize } = state.map;
    const player = toMinimapPoint(state.player, worldSize);

    this.markers.clear();
    drawEnemies(this.markers, state);
    fillBoxes(
      this.markers,
      { color: MINIMAP.chest.color },
      state.chests.map((chest) =>
        markerBox(chest, worldSize, MINIMAP.chest.size),
      ),
    );
    setFill(this.markers, { color: MINIMAP.player.color });
    this.markers.fillCircle(player.x, player.y, MINIMAP.player.radius);
    this.drawFrame(state, visible);
  }
}
