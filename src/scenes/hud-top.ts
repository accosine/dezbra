import type * as Phaser from "phaser";
import { createTextStyle, FONT_SIZE } from "../ui/text-style";
import { formatClock, formatScore } from "../utils/format";
import { drawProgressBar } from "../ui/progress-bar";
import type { GameState } from "../sim/game-state";
import { getElapsedSeconds } from "../sim/step";
import { pickPlayerHealthColor } from "../render/health-colors";
import { TEXTURE_KEYS } from "../render/texture-keys";

const TOP = {
  bestY: 70,
  center: 215,
  depth: 30,
  healthBar: {
    background: "#0a0a0a",
    border: "#333333",
    height: 10,
    width: 106,
    x: 10,
    y: 20,
  },
  label: "#666666",
  left: 10,
  levelY: 56,
  right: 420,
  rows: { firstLabel: 6, firstValue: 18, secondLabel: 34, secondValue: 46 },
  xpBar: {
    background: "#08081a",
    border: "#2a2a3a",
    height: 6,
    width: 106,
    x: 10,
    y: 44,
  },
};
const XP_COLOR = "#9b59b6";
const ALIGN = { center: 0.5, left: 0, right: 1, top: 0 };
const NONE = 0;

type Column = Readonly<{ origin: number; x: number }>;

const COLUMNS: Readonly<Record<"center" | "right", Column>> = {
  center: { origin: ALIGN.center, x: TOP.center },
  right: { origin: ALIGN.right, x: TOP.right },
};

/** Texts of the top HUD row. */
export type HudTop = Readonly<{
  bars: Phaser.GameObjects.Graphics;
  best: Phaser.GameObjects.Text;
  kills: Phaser.GameObjects.Text;
  level: Phaser.GameObjects.Text;
  score: Phaser.GameObjects.Text;
  time: Phaser.GameObjects.Text;
  wave: Phaser.GameObjects.Text;
}>;

const addText = (
  scene: Phaser.Scene,
  position: Readonly<{ column: Column; y: number }>,
  style: Readonly<{ color: string; size: number; text: string }>,
): Phaser.GameObjects.Text =>
  scene.add
    .text(
      position.column.x,
      position.y,
      style.text,
      createTextStyle({ color: style.color, size: style.size }),
    )
    .setOrigin(position.column.origin, ALIGN.top)
    .setDepth(TOP.depth);

const addLabel = (
  scene: Phaser.Scene,
  column: Column,
  label: Readonly<{ text: string; y: number }>,
): void => {
  addText(
    scene,
    { column, y: label.y },
    { color: TOP.label, size: FONT_SIZE.small, text: label.text },
  );
};

const addValue = (
  scene: Phaser.Scene,
  column: Column,
  value: Readonly<{ color: string; y: number }>,
): Phaser.GameObjects.Text =>
  addText(
    scene,
    { column, y: value.y },
    { color: value.color, size: FONT_SIZE.medium, text: "" },
  );

/** Creates health/XP bars, level, score, time, wave, kills and best score. */
export const createHudTop = (scene: Phaser.Scene): HudTop => {
  const left: Column = { origin: ALIGN.left, x: TOP.left };
  const { rows } = TOP;

  scene.add
    .image(NONE, NONE, TEXTURE_KEYS.hudShade)
    .setOrigin(NONE)
    .setDepth(TOP.depth);
  addLabel(scene, left, { text: "LEBEN", y: rows.firstLabel });
  addLabel(scene, left, { text: "EXP", y: rows.secondLabel });
  addLabel(scene, COLUMNS.center, { text: "PUNKTE", y: rows.firstLabel });
  addLabel(scene, COLUMNS.center, { text: "ZEIT", y: rows.secondLabel });
  addLabel(scene, COLUMNS.right, { text: "WELLE", y: rows.firstLabel });
  addLabel(scene, COLUMNS.right, { text: "KILLS", y: rows.secondLabel });

  return {
    bars: scene.add.graphics().setDepth(TOP.depth),
    best: addText(
      scene,
      { column: COLUMNS.right, y: TOP.bestY },
      { color: "#555555", size: FONT_SIZE.small, text: "" },
    ),
    kills: addValue(scene, COLUMNS.right, {
      color: "#ff6b6b",
      y: rows.secondValue,
    }),
    level: addText(
      scene,
      { column: left, y: TOP.levelY },
      { color: "#c39bd3", size: FONT_SIZE.small, text: "" },
    ),
    score: addValue(scene, COLUMNS.center, {
      color: "#f1c40f",
      y: rows.firstValue,
    }),
    time: addValue(scene, COLUMNS.center, {
      color: "#00d4ff",
      y: rows.secondValue,
    }),
    wave: addValue(scene, COLUMNS.right, {
      color: "#2ecc71",
      y: rows.firstValue,
    }),
  };
};

/** Updates the top row from the run state and the stored best score. */
export const updateHudTop = (
  top: HudTop,
  state: GameState,
  bestScore: number,
): void => {
  const healthRatio = state.stats.health / state.stats.maxHealth;

  top.bars.clear();
  drawProgressBar(top.bars, TOP.healthBar, {
    color: pickPlayerHealthColor(healthRatio),
    ratio: healthRatio,
  });
  drawProgressBar(top.bars, TOP.xpBar, {
    color: XP_COLOR,
    ratio: state.progress.xp / state.progress.xpToNextLevel,
  });
  top.level.setText(`LVL ${state.progress.level}`);
  top.score.setText(formatScore(state.progress.score));
  top.time.setText(formatClock(getElapsedSeconds(state)));
  top.wave.setText(String(state.progress.wave));
  top.kills.setText(String(state.progress.kills));
  top.best.setText(bestScore > NONE ? `BEST: ${formatScore(bestScore)}` : "");
};
