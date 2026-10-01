import type * as Phaser from "phaser";
import { createTextStyle, FONT_SIZE } from "../ui/text-style";
import { DEPTHS } from "./depths";
import type { FloatingText } from "../sim/entities";

const FLOAT = { fadeTicks: 22, glow: 8, shadowOffset: 0 };
const CENTER = 0.5;
const OPAQUE = 1;
const NONE = 0;

const showFloat = (
  text: Phaser.GameObjects.Text,
  float: FloatingText,
): void => {
  text
    .setVisible(true)
    .setText(float.text)
    .setColor(float.color)
    .setFontSize(FONT_SIZE[float.isBig ? "large" : "small"])
    .setPosition(float.x, float.y)
    .setAlpha(Math.min(OPAQUE, float.life / FLOAT.fadeTicks))
    .setShadow(
      FLOAT.shadowOffset,
      FLOAT.shadowOffset,
      float.color,
      float.isBig ? FLOAT.glow : NONE,
      false,
      true,
    );
};

/** Pooled texts for rising score numbers. */
export class FloatTextView {
  private readonly scene: Phaser.Scene;

  private readonly texts: Array<Phaser.GameObjects.Text> = [];

  public constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  private getText(index: number): Phaser.GameObjects.Text {
    const existing = this.texts[index];

    if (existing !== undefined) {
      return existing;
    }

    const text = this.scene.add
      .text(
        NONE,
        NONE,
        "",
        createTextStyle({
          align: "center",
          color: "#ffffff",
          size: FONT_SIZE.small,
        }),
      )
      .setOrigin(CENTER)
      .setDepth(DEPTHS.floats);

    this.texts.push(text);

    return text;
  }

  /** Texts currently shown, in order. */
  public get visibleTexts(): ReadonlyArray<string> {
    return this.texts.filter((text) => text.visible).map((text) => text.text);
  }

  /** Shows one text per floating text and hides the rest. */
  public update(floats: ReadonlyArray<FloatingText>): void {
    for (const [index, float] of floats.entries()) {
      showFloat(this.getText(index), float);
    }

    for (const text of this.texts.slice(floats.length)) {
      text.setVisible(false);
    }
  }
}
