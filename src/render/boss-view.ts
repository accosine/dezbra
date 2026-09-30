import type * as Phaser from "phaser";
import { type BossEnemy, isBossEnemy } from "../sim/boss-attacks";
import { createIconStyle, createTextStyle, FONT_SIZE } from "../ui/text-style";
import { fillBoxes, setFill, setStroke } from "./paint";
import { hexToNumber, lightenHex } from "../utils/color";
import { DEPTHS } from "./depths";
import type { GameState } from "../sim/game-state";
import { pickBossHealthColor } from "./health-colors";

type Graphics = Phaser.GameObjects.Graphics;

const BOSS = {
  bar: { alpha: 0.7, height: 6, offset: 14, strokeAlpha: 0.15 },
  eye: {
    color: "#ff0000",
    highlight: "#ff8888",
    pupilRadius: 0.07,
    radius: 0.18,
    spread: 0.32,
    y: -0.08,
  },
  glow: {
    innerAlpha: 0.14,
    innerSwing: 0.08,
    innerWidth: 18,
    outerAlpha: 0.07,
    outerSwing: 0.04,
    outerWidth: 32,
    speed: 0.09,
  },
  iconAlpha: 0.72,
  iconDrop: 0.32,
  iconSize: 0.88,
  lightOffset: -0.22,
  lightRadius: 0.55,
  lighten: 40,
  nameOffset: 16,
  shadow: { alpha: 0.45, drop: 0.65, height: 0.64, width: 1.84 },
  spawn: {
    alpha: 0.75,
    iconThreshold: 0.4,
    ringAlpha: 0.5,
    ringGrowth: 1.5,
    ringWidth: 4,
    totalTicks: 120,
  },
};
const OPAQUE = 1;
const CENTER = 0.5;
const HIDDEN = 0;
const DOUBLE = 2;
const NONE = 0;
const SIDES = [-OPAQUE, OPAQUE];

const drawGlow = (graphics: Graphics, boss: BossEnemy, frame: number): void => {
  const { color } = boss.boss.definition;
  const { glow } = BOSS;
  const pulse = Math.sin(frame * glow.speed);

  setFill(graphics, {
    alpha: glow.innerAlpha + pulse * glow.innerSwing,
    color,
  });
  graphics.fillCircle(boss.x, boss.y, boss.radius + glow.innerWidth);
  setFill(graphics, {
    alpha: glow.outerAlpha + pulse * glow.outerSwing,
    color,
  });
  graphics.fillCircle(boss.x, boss.y, boss.radius + glow.outerWidth);
};

const drawBody = (graphics: Graphics, boss: BossEnemy): void => {
  const { color } = boss.boss.definition;
  const { radius } = boss;

  graphics.fillStyle(hexToNumber("#000000"), BOSS.shadow.alpha);
  graphics.fillEllipse(
    boss.x,
    boss.y + radius * BOSS.shadow.drop,
    radius * BOSS.shadow.width,
    radius * BOSS.shadow.height,
  );
  setFill(graphics, { color });
  graphics.fillCircle(boss.x, boss.y, radius);
  graphics.fillStyle(lightenHex(color, BOSS.lighten));
  graphics.fillCircle(
    boss.x + radius * BOSS.lightOffset,
    boss.y + radius * BOSS.lightOffset,
    radius * BOSS.lightRadius,
  );
};

const drawEyes = (graphics: Graphics, boss: BossEnemy): void => {
  const { eye } = BOSS;
  const y = boss.y + boss.radius * eye.y;

  for (const side of SIDES) {
    const x = boss.x + side * boss.radius * eye.spread;

    setFill(graphics, { color: eye.color });
    graphics.fillCircle(x, y, boss.radius * eye.radius);
    setFill(graphics, { color: eye.highlight });
    graphics.fillCircle(
      x + boss.radius * eye.pupilRadius * CENTER,
      y,
      boss.radius * eye.pupilRadius,
    );
  }
};

const drawBar = (graphics: Graphics, boss: BossEnemy): void => {
  const ratio = boss.health / boss.maxHealth;
  const top = boss.y - boss.radius - BOSS.bar.offset;
  const left = boss.x - boss.radius;
  const width = boss.radius * DOUBLE;

  fillBoxes(graphics, { alpha: BOSS.bar.alpha, color: "#000000" }, [
    { height: BOSS.bar.height, width, x: left, y: top },
  ]);
  fillBoxes(graphics, { color: pickBossHealthColor(ratio) }, [
    { height: BOSS.bar.height, width: width * ratio, x: left, y: top },
  ]);
  setStroke(
    graphics,
    { alpha: BOSS.bar.strokeAlpha, color: "#ffffff" },
    OPAQUE,
  );
  graphics.strokeRect(left, top, width, BOSS.bar.height);
};

const drawSpawn = (graphics: Graphics, boss: BossEnemy): number => {
  const { spawn } = BOSS;
  const progress = Math.min(
    OPAQUE,
    (spawn.totalTicks - boss.spawnTicks) / spawn.totalTicks,
  );

  setFill(graphics, {
    alpha: progress * spawn.alpha,
    color: boss.boss.definition.color,
  });
  graphics.fillCircle(boss.x, boss.y, boss.radius * progress);
  setStroke(
    graphics,
    { alpha: spawn.ringAlpha * (OPAQUE - progress), color: "#ff4444" },
    spawn.ringWidth,
  );
  graphics.strokeCircle(
    boss.x,
    boss.y,
    boss.radius * (OPAQUE + (OPAQUE - progress) * spawn.ringGrowth),
  );

  return progress;
};

/** Draws the active boss as a glowing body with eyes, icon, name and health bar. */
export class BossView {
  private readonly graphics: Graphics;

  private readonly icon: Phaser.GameObjects.Text;

  private readonly name: Phaser.GameObjects.Text;

  public constructor(scene: Phaser.Scene) {
    this.graphics = scene.add.graphics().setDepth(DEPTHS.enemies);
    this.icon = scene.add
      .text(NONE, NONE, "", createIconStyle(FONT_SIZE.large))
      .setOrigin(CENTER)
      .setDepth(DEPTHS.enemies);
    this.name = scene.add
      .text(
        NONE,
        NONE,
        "",
        createTextStyle({
          align: "center",
          color: "#ff5555",
          size: FONT_SIZE.small,
        }),
      )
      .setOrigin(CENTER)
      .setDepth(DEPTHS.enemies);
  }

  private showLabels(boss: BossEnemy, iconAlpha: number): void {
    const { definition } = boss.boss;

    this.icon
      .setText(definition.icon)
      .setFontSize(Math.round(boss.radius * BOSS.iconSize))
      .setPosition(boss.x, boss.y + boss.radius * BOSS.iconDrop)
      .setAlpha(iconAlpha)
      .setVisible(true);
    this.name
      .setText(definition.name)
      .setPosition(boss.x, boss.y - boss.radius - BOSS.nameOffset)
      .setVisible(boss.spawnTicks <= NONE);
  }

  private render(boss: BossEnemy, frame: number): void {
    if (boss.spawnTicks > NONE) {
      const progress = drawSpawn(this.graphics, boss);

      this.showLabels(
        boss,
        progress > BOSS.spawn.iconThreshold ? progress : HIDDEN,
      );

      return;
    }

    drawGlow(this.graphics, boss, frame);
    drawBody(this.graphics, boss);
    drawEyes(this.graphics, boss);
    drawBar(this.graphics, boss);
    this.showLabels(boss, BOSS.iconAlpha);
  }

  /** Whether the boss icon is currently shown. */
  public get isShowingBoss(): boolean {
    return this.icon.visible;
  }

  /** Draws the first boss of the state or hides everything. */
  public update(state: GameState): void {
    const boss = state.enemies.find((enemy): enemy is BossEnemy =>
      isBossEnemy(enemy),
    );

    this.graphics.clear();
    this.icon.setVisible(false);
    this.name.setVisible(false);

    if (boss !== undefined) {
      this.render(boss, state.progress.frame);
    }
  }
}
