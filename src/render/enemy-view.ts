import type * as Phaser from "phaser";
import { fillBoxes, setStroke } from "./paint";
import { getZombieTextureKey, TEXTURE_KEYS } from "./texture-keys";
import { CROWN_SHAPES } from "./enemy-shapes";
import { DEPTHS } from "./depths";
import { drawShapesAt } from "./shape-drawing";
import type { Enemy } from "../sim/entities";
import type { GameState } from "../sim/game-state";
import { hexToNumber } from "../utils/color";
import { pickEnemyHealthColor } from "./health-colors";

const ZOMBIE = {
  barHeight: 3,
  barOffset: 9,
  barWidth: 24,
  bigBarWidth: 36,
  bigScale: 3,
  frozenTint: hexToNumber("#4a6a9a"),
  height: 12,
  lineAlpha: 0.3,
  lineBack: 0.95,
  lineBackShort: 0.88,
  lineFront: 0.55,
  lineHigh: 0.58,
  lineLow: 0.3,
  scale: 2,
  shadowAlpha: 0.28,
  shadowDrop: 3,
  shadowRadiusY: 3.5,
  shadowWidth: 0.96,
  spawnAlpha: 0.8,
  spawnFade: 8,
  spawnGrowth: 1.1,
  spawnRadius: 20,
  spawnStroke: 2,
  variants: 3,
  width: 7,
};
const RED = "#ff5a5a";
const BOTTOM = 1;
const CENTER = 0.5;
const OPAQUE = 1;
const DOUBLE = 2;
const NONE = 0;

const measureZombie = (
  enemy: Enemy,
): Readonly<{ height: number; width: number }> => {
  const scale = ZOMBIE[enemy.isBig ? "bigScale" : "scale"];

  return { height: ZOMBIE.height * scale, width: ZOMBIE.width * scale };
};

const drawShadow = (
  graphics: Phaser.GameObjects.Graphics,
  enemy: Enemy,
): void => {
  graphics.fillStyle(hexToNumber("#000000"), ZOMBIE.shadowAlpha);
  graphics.fillEllipse(
    enemy.x,
    enemy.y + ZOMBIE.shadowDrop,
    measureZombie(enemy).width * ZOMBIE.shadowWidth,
    ZOMBIE.shadowRadiusY * DOUBLE,
  );
};

const drawSpeedLines = (
  graphics: Phaser.GameObjects.Graphics,
  enemy: Enemy,
  side: number,
): void => {
  const size = measureZombie(enemy);

  setStroke(graphics, { alpha: ZOMBIE.lineAlpha, color: RED }, OPAQUE);

  for (const line of [
    { back: ZOMBIE.lineBack, height: ZOMBIE.lineLow },
    { back: ZOMBIE.lineBackShort, height: ZOMBIE.lineHigh },
  ]) {
    const y = enemy.y - size.height * line.height;

    graphics.lineBetween(
      enemy.x + side * size.width * ZOMBIE.lineFront,
      y,
      enemy.x + side * size.width * line.back,
      y,
    );
  }
};

const drawHealthBar = (
  graphics: Phaser.GameObjects.Graphics,
  enemy: Enemy,
): void => {
  const ratio = enemy.health / enemy.maxHealth;
  const width = ZOMBIE[enemy.isBig ? "bigBarWidth" : "barWidth"];
  const top = enemy.y - measureZombie(enemy).height - ZOMBIE.barOffset;
  const left = enemy.x - width * CENTER;

  fillBoxes(graphics, { color: "#0a0a0a" }, [
    { height: ZOMBIE.barHeight, width, x: left, y: top },
  ]);
  fillBoxes(graphics, { color: pickEnemyHealthColor(ratio) }, [
    { height: ZOMBIE.barHeight, width: width * ratio, x: left, y: top },
  ]);
};

const drawSpawnRing = (
  graphics: Phaser.GameObjects.Graphics,
  enemy: Enemy,
): void => {
  setStroke(
    graphics,
    {
      alpha:
        Math.min(OPAQUE, enemy.spawnTicks / ZOMBIE.spawnFade) *
        ZOMBIE.spawnAlpha,
      color: RED,
    },
    ZOMBIE.spawnStroke,
  );
  graphics.strokeCircle(
    enemy.x,
    enemy.y,
    ZOMBIE.spawnRadius + enemy.spawnTicks * ZOMBIE.spawnGrowth,
  );
};

const drawDetails = (
  graphics: Phaser.GameObjects.Graphics,
  enemy: Enemy,
  state: GameState,
): void => {
  const isFrozen = state.progress.freezeTicks > NONE;

  if (enemy.isBig) {
    drawShapesAt(graphics, CROWN_SHAPES, {
      alpha: OPAQUE,
      x: enemy.x,
      y: enemy.y - measureZombie(enemy).height,
    });
  }

  if (enemy.isFast && !isFrozen) {
    drawSpeedLines(
      graphics,
      enemy,
      state.player.x < enemy.x ? OPAQUE : -OPAQUE,
    );
  }

  if (enemy.health < enemy.maxHealth) {
    drawHealthBar(graphics, enemy);
  }
};

const placeSprite = (
  image: Phaser.GameObjects.Image,
  enemy: Enemy,
  state: GameState,
): void => {
  image
    .setVisible(true)
    .setTexture(
      enemy.isBig
        ? TEXTURE_KEYS.brute
        : getZombieTextureKey(enemy.variant % ZOMBIE.variants),
    )
    .setScale(ZOMBIE[enemy.isBig ? "bigScale" : "scale"])
    .setPosition(enemy.x, enemy.y + enemy.walkFrame)
    .setFlipX(state.player.x < enemy.x);

  if (state.progress.freezeTicks > NONE) {
    image.setTint(ZOMBIE.frozenTint);
  } else {
    image.clearTint();
  }
};

/** Pooled sprites plus shadow and detail layers for regular zombies. */
export class EnemyView {
  private readonly details: Phaser.GameObjects.Graphics;

  private readonly images: Array<Phaser.GameObjects.Image> = [];

  private readonly scene: Phaser.Scene;

  private readonly shadows: Phaser.GameObjects.Graphics;

  public constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.shadows = scene.add.graphics().setDepth(DEPTHS.shadows);
    this.details = scene.add.graphics().setDepth(DEPTHS.enemyDetails);
  }

  private getImage(index: number): Phaser.GameObjects.Image {
    const existing = this.images[index];

    if (existing !== undefined) {
      return existing;
    }

    const image = this.scene.add
      .image(NONE, NONE, TEXTURE_KEYS.brute)
      .setOrigin(CENTER, BOTTOM)
      .setDepth(DEPTHS.enemies);

    this.images.push(image);

    return image;
  }

  private drawWalking(walking: ReadonlyArray<Enemy>, state: GameState): void {
    for (const [index, enemy] of walking.entries()) {
      drawShadow(this.shadows, enemy);
      placeSprite(this.getImage(index), enemy, state);
      drawDetails(this.details, enemy, state);
    }

    for (const image of this.images.slice(walking.length)) {
      image.setVisible(false);
    }
  }

  /** Number of zombie sprites currently shown. */
  public get visibleCount(): number {
    return this.images.filter((image) => image.visible).length;
  }

  /** Shows every zombie of the state; bosses are drawn by the boss view. */
  public update(state: GameState): void {
    const zombies = state.enemies.filter((enemy) => enemy.boss === null);

    this.shadows.clear();
    this.details.clear();

    for (const zombie of zombies) {
      if (zombie.spawnTicks > NONE) {
        drawSpawnRing(this.details, zombie);
      }
    }

    this.drawWalking(
      zombies.filter((zombie) => zombie.spawnTicks <= NONE),
      state,
    );
  }
}
