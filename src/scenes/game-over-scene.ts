import * as Phaser from "phaser";
import { addCaption, addHeading, addIcon } from "../ui/screen-text";
import { BUTTON_COLORS, createButton } from "../ui/button";
import { createTextStyle, FONT_SIZE } from "../ui/text-style";
import { formatClock, formatScore } from "../utils/format";
import { announceUnlocks } from "./character-select-scene";
import { GAME_WIDTH } from "../constants";
import { PlayScene } from "./play-scene";
import type { RunReport } from "./run-report";
import { SCENE_KEYS } from "./scene-keys";

const LAYOUT = {
  buttonGap: 58,
  buttonWidth: 250,
  buttonsY: 640,
  columnWidth: 100,
  comboY: 420,
  goalY: 470,
  labelOffset: 22,
  statsY: 300,
  subtitleY: 240,
  titleY: 200,
  weaponsY: 380,
};
const RED = "#c0392b";
const GOLD = "#f1c40f";
const HALF = 0.5;
const NONE = 0;
const ICON_SIZE = 20;
const COLUMNS = 4;

const listStats = (
  report: RunReport,
): ReadonlyArray<Readonly<{ label: string; value: string }>> => [
  {
    label: "PUNKTE",
    value: `${report.isNewBest ? "⭐ " : ""}${formatScore(report.summary.score)}`,
  },
  { label: "ZEIT", value: formatClock(report.summary.seconds) },
  { label: "KILLS", value: String(report.summary.kills) },
  { label: "🪙 MÜNZEN", value: String(report.summary.coins) },
];

/** Summary of a finished run with retry and menu buttons. */
export class GameOverScene extends Phaser.Scene {
  public constructor() {
    super(SCENE_KEYS.gameOver);
  }

  private addStats(report: RunReport): void {
    const left =
      (GAME_WIDTH - COLUMNS * LAYOUT.columnWidth) * HALF +
      LAYOUT.columnWidth * HALF;

    for (const [index, stat] of listStats(report).entries()) {
      const x = left + index * LAYOUT.columnWidth;

      this.add
        .text(
          x,
          LAYOUT.statsY,
          stat.value,
          createTextStyle({
            align: "center",
            color: GOLD,
            size: FONT_SIZE.medium,
          }),
        )
        .setOrigin(HALF);
      this.add
        .text(
          x,
          LAYOUT.statsY + LAYOUT.labelOffset,
          stat.label,
          createTextStyle({
            align: "center",
            color: "#555555",
            size: FONT_SIZE.small,
          }),
        )
        .setOrigin(HALF);
    }
  }

  private addDetails(report: RunReport): void {
    addIcon(
      this,
      { size: ICON_SIZE, x: GAME_WIDTH * HALF, y: LAYOUT.weaponsY },
      report.summary.weaponIcons,
    );

    if (report.summary.bestCombo > NONE) {
      addCaption(this, {
        color: "#f39c12",
        text: `BEST COMBO: ×${report.summary.bestCombo}`,
        y: LAYOUT.comboY,
      });
    }

    if (report.nextGoal !== undefined) {
      addCaption(this, {
        color: "#777777",
        text: `NÄCHSTES ZIEL: ${report.nextGoal}`,
        y: LAYOUT.goalY,
      });
    }
  }

  private addButtons(): void {
    const leave = (key: string) => (): void => {
      this.scene.start(key);
    };

    createButton(this, {
      colors: BUTTON_COLORS.green,
      label: "↺ NOCHMAL",
      onPress: leave(SCENE_KEYS.characterSelect),
      width: LAYOUT.buttonWidth,
      x: GAME_WIDTH * HALF,
      y: LAYOUT.buttonsY,
    });
    createButton(this, {
      colors: BUTTON_COLORS.red,
      label: "⌂ HAUPTMENÜ",
      onPress: leave(SCENE_KEYS.menu),
      width: LAYOUT.buttonWidth,
      x: GAME_WIDTH * HALF,
      y: LAYOUT.buttonsY + LAYOUT.buttonGap,
    });
  }

  public create(): void {
    const play = this.scene.get(SCENE_KEYS.play);
    const report = play instanceof PlayScene ? play.runReport : null;

    this.cameras.main.setBackgroundColor("#000000");
    addHeading(this, {
      color: RED,
      size: FONT_SIZE.title,
      text: "DU BIST TOT",
      y: LAYOUT.titleY,
    });
    addCaption(this, {
      color: "#555555",
      text: "DIE HORDE HAT GEWONNEN",
      y: LAYOUT.subtitleY,
    });

    if (report !== null) {
      this.addStats(report);
      this.addDetails(report);
      announceUnlocks(this, report.unlocks);
    }

    this.addButtons();
  }
}
