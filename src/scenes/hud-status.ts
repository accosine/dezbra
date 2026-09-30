import type * as Phaser from "phaser";
import { type BossEnemy, isBossEnemy } from "../sim/boss-attacks";
import { createTextStyle, FONT_SIZE } from "../ui/text-style";
import { pickComboColor, pickWaveColor } from "../render/health-colors";
import { fillBoxes } from "../render/paint";
import { GAME_WIDTH } from "../constants";
import type { GameState } from "../sim/game-state";
import { WAVE_TUNING } from "../sim/tuning";

const STATUS = {
  bossBar: {
    background: "#0a0000",
    border: "#770000",
    fill: "#e74c3c",
    height: 12,
    left: 10,
    nameY: 86,
    top: 98,
  },
  combo: {
    bigFrom: 10,
    fadeTicks: 30,
    minimum: 3,
    pulseSpeed: 0.18,
    pulseSwing: 0.06,
    y: 632,
  },
  depth: 30,
  enemyCount: { x: 348, y: 660 },
  hint: { x: 420, y: 800 },
  waveBar: {
    background: "#000000",
    backgroundAlpha: 0.6,
    height: 4,
    pulseAlpha: 0.3,
    pulseFrom: 0.9,
    pulseSpeed: 0.3,
    pulseSwing: 0.2,
    top: 826,
  },
};
const HALF = 0.5;
const OPAQUE = 1;
const NONE = 0;
const DOUBLE = 2;
const RIGHT = 1;

/** Boss bar, combo counter, enemy counter, wave timer and control hint. */
export type HudStatus = Readonly<{
  bars: Phaser.GameObjects.Graphics;
  bossName: Phaser.GameObjects.Text;
  combo: Phaser.GameObjects.Text;
  enemyCount: Phaser.GameObjects.Text;
}>;

const addControlHint = (scene: Phaser.Scene): void => {
  scene.add
    .text(
      STATUS.hint.x,
      STATUS.hint.y,
      "AUTO-FEUER ✓\nJOYSTICK = LAUFEN",
      createTextStyle({
        align: "right",
        color: "#34344a",
        size: FONT_SIZE.small,
      }),
    )
    .setOrigin(RIGHT, HALF)
    .setDepth(STATUS.depth);
};

/** Creates the status widgets of the HUD. */
export const createHudStatus = (scene: Phaser.Scene): HudStatus => {
  addControlHint(scene);

  return {
    bars: scene.add.graphics().setDepth(STATUS.depth),
    bossName: scene.add
      .text(
        GAME_WIDTH * HALF,
        STATUS.bossBar.nameY,
        "",
        createTextStyle({
          align: "center",
          color: "#ff4444",
          size: FONT_SIZE.small,
        }),
      )
      .setOrigin(HALF)
      .setDepth(STATUS.depth),
    combo: scene.add
      .text(
        GAME_WIDTH * HALF,
        STATUS.combo.y,
        "",
        createTextStyle({
          align: "center",
          color: "#f1c40f",
          size: FONT_SIZE.medium,
        }),
      )
      .setOrigin(HALF)
      .setDepth(STATUS.depth),
    enemyCount: scene.add
      .text(
        STATUS.enemyCount.x,
        STATUS.enemyCount.y,
        "",
        createTextStyle({
          align: "right",
          color: "#ff6464",
          size: FONT_SIZE.small,
        }),
      )
      .setOrigin(RIGHT, HALF)
      .setDepth(STATUS.depth),
  };
};

const drawBossBar = (status: HudStatus, state: GameState): void => {
  const boss = state.enemies.find((enemy): enemy is BossEnemy =>
    isBossEnemy(enemy),
  );
  const { bossBar } = STATUS;
  const width = GAME_WIDTH - bossBar.left - bossBar.left;

  status.bossName.setVisible(boss !== undefined);

  if (boss === undefined) {
    return;
  }

  status.bossName.setText(
    `${boss.boss.definition.icon} ${boss.boss.definition.name}`,
  );
  fillBoxes(status.bars, { color: bossBar.border }, [
    {
      height: bossBar.height + DOUBLE + DOUBLE,
      width: width + DOUBLE + DOUBLE,
      x: bossBar.left - DOUBLE,
      y: bossBar.top - DOUBLE,
    },
  ]);
  fillBoxes(status.bars, { color: bossBar.background }, [
    { height: bossBar.height, width, x: bossBar.left, y: bossBar.top },
  ]);
  fillBoxes(status.bars, { color: bossBar.fill }, [
    {
      height: bossBar.height,
      width: width * Math.max(NONE, boss.health / boss.maxHealth),
      x: bossBar.left,
      y: bossBar.top,
    },
  ]);
};

const drawWaveBar = (status: HudStatus, state: GameState): void => {
  const { waveBar } = STATUS;
  const progress = state.progress.waveTicks / WAVE_TUNING.waveTicks;
  const bar = {
    height: waveBar.height,
    width: GAME_WIDTH * progress,
    x: NONE,
    y: waveBar.top,
  };

  fillBoxes(
    status.bars,
    { alpha: waveBar.backgroundAlpha, color: waveBar.background },
    [{ ...bar, width: GAME_WIDTH }],
  );
  fillBoxes(status.bars, { color: pickWaveColor(progress) }, [bar]);

  if (progress > waveBar.pulseFrom) {
    fillBoxes(
      status.bars,
      {
        alpha:
          waveBar.pulseAlpha +
          Math.sin(state.progress.frame * waveBar.pulseSpeed) *
            waveBar.pulseSwing,
        color: "#f39c12",
      },
      [bar],
    );
  }
};

const updateCombo = (status: HudStatus, state: GameState): void => {
  const { combo, comboTicks, frame } = state.progress;
  const scale =
    OPAQUE +
    Math.sin(frame * STATUS.combo.pulseSpeed) * STATUS.combo.pulseSwing;

  status.combo
    .setVisible(combo >= STATUS.combo.minimum)
    .setText(`${combo}× COMBO`)
    .setColor(pickComboColor(combo))
    .setFontSize(FONT_SIZE[combo >= STATUS.combo.bigFrom ? "large" : "medium"])
    .setAlpha(Math.min(OPAQUE, comboTicks / STATUS.combo.fadeTicks))
    .setScale(scale);
};

/** Updates boss bar, wave timer, combo and enemy counter. */
export const updateHudStatus = (status: HudStatus, state: GameState): void => {
  const alive = state.enemies.filter(
    (enemy) => enemy.boss === null && enemy.spawnTicks <= NONE,
  ).length;

  status.bars.clear();
  drawBossBar(status, state);
  drawWaveBar(status, state);
  updateCombo(status, state);
  status.enemyCount.setText(`👾 ${alive}`);
};
