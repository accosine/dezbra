import type * as Phaser from "phaser";
import { DEPTHS } from "./depths";
import { drawShapesAt } from "./shape-drawing";
import type { GameState } from "../sim/game-state";
import { getCharacterTextureKey } from "./texture-keys";
import { GUN_SHAPES } from "./player-shapes";
import { hexToNumber } from "../utils/color";
import { setFill } from "./paint";
import { WEAPONS } from "../data/weapons";

const PLAYER = {
  blinkOn: 2,
  blinkPeriod: 4,
  gunHeight: 0.44,
  height: 32,
  scale: 2,
  shadow: { alpha: 0.32, drop: 2, height: 8, width: 22 },
  shield: {
    color: "#4fc3f7",
    fillAlpha: 0.05,
    fillSwing: 0.04,
    radius: 0.65,
    speed: 0.12,
    strokeAlpha: 0.38,
    strokeSwing: 0.28,
    width: 2,
  },
  width: 20,
};
const FALLBACK_GUN_COLOR = "#aaaaaa";
const BOTTOM = 1;
const CENTER = 0.5;
const NONE = 0;
const OPAQUE = 1;

const isBlinking = (state: GameState): boolean =>
  state.player.invulnerableTicks > NONE &&
  state.progress.frame % PLAYER.blinkPeriod < PLAYER.blinkOn;

const drawShield = (
  graphics: Phaser.GameObjects.Graphics,
  state: GameState,
): void => {
  const { shield } = PLAYER;
  const pulse = Math.sin(state.progress.frame * shield.speed);
  const centerY = state.player.y - PLAYER.height * CENTER;
  const radius = PLAYER.height * shield.radius;

  graphics.lineStyle(
    shield.width,
    hexToNumber(shield.color),
    shield.strokeAlpha + pulse * shield.strokeSwing,
  );
  graphics.strokeCircle(state.player.x, centerY, radius);
  setFill(graphics, {
    alpha: shield.fillAlpha + pulse * shield.fillSwing,
    color: shield.color,
  });
  graphics.fillCircle(state.player.x, centerY, radius);
};

const drawGun = (
  graphics: Phaser.GameObjects.Graphics,
  state: GameState,
): void => {
  const [mainWeapon] = state.weapons;

  graphics.save();
  graphics.translateCanvas(
    state.player.x,
    Math.floor(state.player.y - PLAYER.height * PLAYER.gunHeight),
  );
  graphics.scaleCanvas(state.player.facing, OPAQUE);
  drawShapesAt(graphics, GUN_SHAPES, {
    alpha: OPAQUE,
    variantColor:
      mainWeapon === undefined
        ? FALLBACK_GUN_COLOR
        : WEAPONS[mainWeapon.id].color,
    x: PLAYER.width * CENTER,
    y: NONE,
  });
  graphics.restore();
};

/** The player sprite with shadow, shield bubble and gun; blinks while invulnerable. */
export class PlayerView {
  private readonly front: Phaser.GameObjects.Graphics;

  private readonly image: Phaser.GameObjects.Image;

  private readonly shadow: Phaser.GameObjects.Graphics;

  public constructor(scene: Phaser.Scene, state: GameState) {
    this.shadow = scene.add.graphics().setDepth(DEPTHS.shadows);
    this.front = scene.add.graphics().setDepth(DEPTHS.player);
    this.image = scene.add
      .image(
        state.player.x,
        state.player.y,
        getCharacterTextureKey(state.character.id),
      )
      .setOrigin(CENTER, BOTTOM)
      .setScale(PLAYER.scale)
      .setDepth(DEPTHS.player);
  }

  /** Whether the sprite is currently visible (false while blinking). */
  public get isVisible(): boolean {
    return this.image.visible;
  }

  /** Mirrors the player's position, facing, walk bob and shield. */
  public update(state: GameState): void {
    const isShown = !isBlinking(state);

    this.shadow.clear().setVisible(isShown);
    this.front.clear().setVisible(isShown);
    this.image
      .setVisible(isShown)
      .setPosition(state.player.x, state.player.y + state.player.walkFrame)
      .setFlipX(state.player.facing < NONE);
    setFill(this.shadow, { alpha: PLAYER.shadow.alpha, color: "#000000" });
    this.shadow.fillEllipse(
      state.player.x,
      state.player.y + PLAYER.shadow.drop,
      PLAYER.shadow.width,
      PLAYER.shadow.height,
    );
    drawGun(this.front, state);

    if (state.stats.hasShield) {
      drawShield(this.front, state);
    }
  }
}
