import {
  createTestBoss,
  createTestEnemy,
  createTestState,
} from "../sim/sim-fixtures";
import { describe, expect, it } from "vitest";
import { MINIMAP_LAYOUT, MinimapView, toMinimapRect } from "./minimap-view";
import { generateWorld } from "../sim/world-generation";
import { MAPS } from "../data/maps";
import { toEnemyId } from "../sim/entities";
import { useHarnessScene } from "../harness/phaser-harness";

const getScene = useHarnessScene();
const WORLD = 700;
const BIG_ID = 2;
const FIRST = 0;
const VISIBLE = { height: 830, width: 430, x: 0, y: 0 };

describe("toMinimapRect", (): void => {
  it("scales world rectangles and keeps tiny ones visible", (): void => {
    expect(
      toMinimapRect({ height: 100, width: 200, x: 70, y: 350 }, WORLD),
    ).toEqual({ height: 10, width: 20, x: 7, y: 35 });
    expect(
      toMinimapRect({ height: 1, width: 1, x: 0, y: 0 }, WORLD),
    ).toMatchObject({ height: 1, width: 1 });
  });
});

describe("MinimapView", (): void => {
  it("bakes the buildings once per map and draws live markers", (): void => {
    const scene = getScene();
    const base = createTestState();
    const state = {
      ...base,
      chests: [{ animationTicks: 0, x: 10, y: 10 }],
      enemies: [
        createTestEnemy(),
        createTestEnemy({ id: toEnemyId(BIG_ID), isBig: true }),
        createTestEnemy({ id: toEnemyId(BIG_ID + BIG_ID), spawnTicks: BIG_ID }),
        createTestBoss("nightmare"),
      ],
      world: generateWorld(MAPS.city),
    };

    const first = new MinimapView(scene, state);
    const second = new MinimapView(scene, state);

    first.update(state, VISIBLE);
    second.update(state, VISIBLE);

    expect(scene.textures.exists(`minimap-${state.map.id}`)).toBe(true);
    expect(
      scene.textures.get(`minimap-${state.map.id}`).source.at(FIRST)?.width,
    ).toBe(MINIMAP_LAYOUT.size);
  });
});
