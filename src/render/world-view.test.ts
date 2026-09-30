import * as Phaser from "phaser";
import { createWorldView, updateWorldView } from "./world-view";
import { describe, expect, it } from "vitest";
import { createGameTextures } from "./game-textures";
import { generateWorld } from "../sim/world-generation";
import { MAPS } from "../data/maps";
import { TEXTURE_KEYS } from "./texture-keys";
import { useHarnessScene } from "../harness/phaser-harness";

const getScene = useHarnessScene();
const VIEW = { height: 830, width: 430 };
const FRAME = 10;
const NONE = 0;

const countImages = (scene: Phaser.Scene, key: string): number =>
  scene.children.list.filter(
    (child) =>
      child instanceof Phaser.GameObjects.Image && child.texture.key === key,
  ).length;

describe("createWorldView", (): void => {
  it("adds every building, stain and decoration of the world", (): void => {
    const scene = getScene();
    const world = generateWorld(MAPS.city);

    createGameTextures(scene, VIEW);

    const view = createWorldView(scene, world, MAPS.city);

    expect(view.buildings).toHaveLength(world.buildings.length);
    expect(countImages(scene, TEXTURE_KEYS.stain)).toBe(world.stains.length);
    expect(countImages(scene, TEXTURE_KEYS.mist)).toBe(NONE);
  });

  it("adds the mist overlay on the cemetery", (): void => {
    const scene = getScene();

    createGameTextures(scene, VIEW);
    createWorldView(
      scene,
      { buildings: [], decorations: [], stains: [] },
      MAPS.cemetery,
    );

    expect(countImages(scene, TEXTURE_KEYS.mist)).toBeGreaterThan(NONE);
  });
});

describe("updateWorldView", (): void => {
  it("only shows buildings near the visible area", (): void => {
    const scene = getScene();
    const world = generateWorld(MAPS.city);

    createGameTextures(scene, VIEW);

    const view = createWorldView(scene, world, MAPS.city);

    updateWorldView(view, {
      frame: FRAME,
      visible: { ...VIEW, x: NONE, y: NONE },
    });

    const visible = view.buildings.filter((entry) => entry.graphics.visible);

    expect(visible.length).toBeGreaterThan(NONE);
    expect(visible.length).toBeLessThan(world.buildings.length);
  });
});
