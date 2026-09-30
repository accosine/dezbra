import {
  createTestBoss,
  createTestBullet,
  createTestEnemy,
  createTestState,
} from "../sim/sim-fixtures";
import { describe, expect, it } from "vitest";
import {
  drawBullets,
  drawChests,
  drawGems,
  drawParticles,
} from "./effects-renderer";
import {
  pickBossHealthColor,
  pickEnemyHealthColor,
  pickPlayerHealthColor,
} from "./health-colors";
import { samplePixel, useHarnessScene } from "../harness/phaser-harness";
import { BossView } from "./boss-view";
import { createGameTextures } from "./game-textures";
import { EnemyView } from "./enemy-view";
import type { GameState } from "../sim/game-state";
import { toEnemyId } from "../sim/entities";

const getScene = useHarnessScene();
const VIEW = { height: 830, width: 430 };
const CANVAS = { height: 60, width: 60 };
const CENTER = { x: 30, y: 30 };
const OPAQUE = 255;
const NONE = 0;
const SINGLE = 1;
const PAIR = 2;
const ORBIT = { angle: 0, radius: 10, speed: 0.1 };
const RATIOS = { high: 0.8, low: 0.1, middle: 0.4 };
const SPAWNING = 60;
const EARLY_SPAWN = 115;

const stateWith = (overrides: Partial<GameState>): GameState => ({
  ...createTestState(),
  ...overrides,
});

describe("health colors", (): void => {
  it("turns bars from green to orange to red", (): void => {
    expect(
      [RATIOS.high, RATIOS.middle, RATIOS.low].map((ratio) =>
        pickEnemyHealthColor(ratio),
      ),
    ).toEqual(["#27ae60", "#e67e22", "#c0392b"]);
    expect(
      [RATIOS.high, RATIOS.middle, RATIOS.low].map((ratio) =>
        pickBossHealthColor(ratio),
      ),
    ).toEqual(["#27ae60", "#e67e22", "#e74c3c"]);
    expect(
      [RATIOS.high, RATIOS.middle, RATIOS.low].map((ratio) =>
        pickPlayerHealthColor(ratio),
      ),
    ).toEqual(["#27ae60", "#e67e22", "#c0392b"]);
  });
});

describe("effects renderer", (): void => {
  it("draws every kind of bullet, gem, chest and particle", (): void => {
    const graphics = getScene().add.graphics();

    drawBullets(graphics, [
      createTestBullet({ velocity: { x: 5, y: 0 }, x: CENTER.x, y: CENTER.y }),
      createTestBullet({
        isLaser: true,
        velocity: { x: 5, y: 0 },
        x: CENTER.x,
        y: CENTER.y,
      }),
      createTestBullet({ orbit: ORBIT, x: CENTER.x, y: CENTER.y }),
      createTestBullet({ isBlackHole: true, x: CENTER.x, y: CENTER.y }),
    ]);
    drawGems(graphics, [
      { life: 100, value: 1, velocity: { x: 0, y: 0 }, x: 5, y: 5 },
    ]);
    drawChests(graphics, [{ animationTicks: 3, x: 40, y: 40 }]);
    drawParticles(graphics, [
      {
        color: "#ffffff",
        isRing: false,
        life: 5,
        maxLife: 10,
        size: 3,
        velocity: { x: 0, y: 0 },
        x: 50,
        y: 5,
      },
      {
        color: "#ffffff",
        isRing: true,
        life: 5,
        maxLife: 10,
        size: 30,
        velocity: { x: 0, y: 0 },
        x: 10,
        y: 50,
      },
    ]);

    expect(samplePixel(graphics, CANVAS, CENTER).alpha).toBe(OPAQUE);
  });
});

describe("EnemyView", (): void => {
  it("shows walking zombies, hides spawning ones and reuses sprites", (): void => {
    const scene = getScene();
    const view = new EnemyView(scene);
    const state = createTestState();
    const walker = createTestEnemy({
      health: 5,
      isBig: true,
      isFast: true,
      x: state.player.x + SPAWNING,
      y: state.player.y,
    });
    const crowd = [
      walker,
      createTestEnemy({ id: toEnemyId(PAIR), spawnTicks: 5 }),
      createTestBoss("fleshMountain"),
    ];

    createGameTextures(scene, VIEW);
    view.update(stateWith({ enemies: crowd }));
    expect(view.visibleCount).toBe(SINGLE);
    view.update(
      stateWith({
        enemies: [],
        progress: { ...state.progress, freezeTicks: SPAWNING },
      }),
    );
    expect(view.visibleCount).toBe(NONE);
  });
});

describe("EnemyView details", (): void => {
  it("draws frozen zombies and regular zombies on either side", (): void => {
    const scene = getScene();
    const view = new EnemyView(scene);
    const state = createTestState();
    const walker = createTestEnemy({
      isFast: true,
      x: state.player.x + SPAWNING,
      y: state.player.y,
    });
    const frozen = {
      ...stateWith({ enemies: [walker] }),
      progress: { ...state.progress, freezeTicks: SPAWNING },
    };
    const leftSide = stateWith({
      enemies: [
        createTestEnemy({
          health: 5,
          isFast: true,
          x: state.player.x - SPAWNING,
          y: state.player.y,
        }),
      ],
    });

    createGameTextures(scene, VIEW);
    view.update(frozen);
    view.update(leftSide);
    expect(view.visibleCount).toBe(SINGLE);
  });
});

describe("BossView", (): void => {
  it("shows a spawning and a fighting boss and hides without one", (): void => {
    const view = new BossView(getScene());

    view.update(
      stateWith({
        enemies: [createTestBoss("nightmare", { spawnTicks: SPAWNING })],
      }),
    );
    expect(view.isShowingBoss).toBe(true);
    view.update(
      stateWith({
        enemies: [createTestBoss("nightmare", { spawnTicks: EARLY_SPAWN })],
      }),
    );
    expect(view.isShowingBoss).toBe(true);
    view.update(
      stateWith({ enemies: [createTestBoss("nightmare", { health: 5 })] }),
    );
    expect(view.isShowingBoss).toBe(true);
    view.update(stateWith({ enemies: [] }));
    expect(view.isShowingBoss).toBe(false);
  });
});
