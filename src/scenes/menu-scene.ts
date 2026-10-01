import * as Phaser from "phaser";
import { addCaption, addHeading } from "../ui/screen-text";
import { BUTTON_COLORS, createButton } from "../ui/button";
import { FONT_SIZE } from "../ui/text-style";
import { GAME_WIDTH } from "../constants";
import { hexToNumber } from "../utils/color";
import { SCENE_KEYS } from "./scene-keys";

const MENU = {
  buttonGap: 60,
  buttonWidth: 250,
  buttonsY: 470,
  glow: { alpha: 0.5, color: "#14040a", height: 520, width: 520, y: 450 },
  pulse: { base: 26, speed: 0.003, swing: 16 },
  subtitleY: 390,
  tipsY: 640,
  titleY: 300,
};
const HALF = 0.5;
const TITLE_COLOR = "#c0392b";

/** Title screen with play and shop buttons. */
export class MenuScene extends Phaser.Scene {
  private title: Phaser.GameObjects.Text | null = null;

  public constructor() {
    super(SCENE_KEYS.menu);
  }

  public create(): void {
    this.add.ellipse(
      GAME_WIDTH * HALF,
      MENU.glow.y,
      MENU.glow.width,
      MENU.glow.height,
      hexToNumber(MENU.glow.color),
      MENU.glow.alpha,
    );
    this.title = addHeading(this, {
      color: TITLE_COLOR,
      size: FONT_SIZE.huge,
      text: "DEAD\nPIXELS",
      y: MENU.titleY,
    });
    addCaption(this, {
      color: "#555555",
      text: "◆ DEAD CITY ◆",
      y: MENU.subtitleY,
    });
    createButton(this, {
      colors: BUTTON_COLORS.red,
      label: "▶ SPIELEN",
      onPress: (): void => {
        this.scene.start(SCENE_KEYS.characterSelect);
      },
      width: MENU.buttonWidth,
      x: GAME_WIDTH * HALF,
      y: MENU.buttonsY,
    });
    createButton(this, {
      colors: BUTTON_COLORS.purple,
      label: "🛒 SHOP",
      onPress: (): void => {
        this.scene.start(SCENE_KEYS.shop);
      },
      width: MENU.buttonWidth,
      x: GAME_WIDTH * HALF,
      y: MENU.buttonsY + MENU.buttonGap,
    });
    addCaption(this, {
      color: "#3a3a3a",
      text: "CHARAKTER + KARTE WÄHLEN\n\nAUTO-FEUER · ERKUNDE · ÜBERLEBE\n\nBOSSE → TRUHEN → UPGRADES",
      y: MENU.tipsY,
    });
    this.cameras.main.setBackgroundColor("#07080e");
  }

  public update(time: number): void {
    this.title?.setShadowBlur(
      MENU.pulse.base + Math.sin(time * MENU.pulse.speed) * MENU.pulse.swing,
    );
  }
}
