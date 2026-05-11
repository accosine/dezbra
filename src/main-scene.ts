import * as Phaser from "phaser";
import {
  LOGO_ORIGIN,
  LOGO_TWEEN_DURATION,
  LOGO_TWEEN_PROPERTY,
  LOGO_TWEEN_REPEAT,
  LOGO_TWEEN_TARGET_Y,
  LOGO_X,
  LOGO_Y,
  POINTER_CIRCLE_ALPHA,
  POINTER_CIRCLE_FILL_COLOR,
  POINTER_CIRCLE_RADIUS,
  TITLE_X,
  TITLE_Y,
} from "./constants";

/** Main playable scene for the Phaser game shell. */
export class MainScene extends Phaser.Scene {
  constructor() {
    super("main-scene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#1e293b");

    this.add.text(TITLE_X, TITLE_Y, "Phaser 4 + Vite + TypeScript", {
      color: "#f8fafc",
      fontFamily: "monospace",
      fontSize: "18px",
    });

    const logo = this.add
      .text(LOGO_X, LOGO_Y, "🕹️", {
        fontSize: "56px",
      })
      .setOrigin(LOGO_ORIGIN);

    this.tweens.add({
      [LOGO_TWEEN_PROPERTY]: LOGO_TWEEN_TARGET_Y,
      duration: LOGO_TWEEN_DURATION,
      ease: "Sine.InOut",
      repeat: LOGO_TWEEN_REPEAT,
      targets: logo,
      yoyo: true,
    });

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer): void => {
      this.add
        .circle(
          pointer.x,
          pointer.y,
          POINTER_CIRCLE_RADIUS,
          POINTER_CIRCLE_FILL_COLOR,
        )
        .setAlpha(POINTER_CIRCLE_ALPHA);
    });
  }
}
