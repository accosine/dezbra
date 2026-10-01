import type * as Phaser from "phaser";
import { DEPTHS } from "./depths";
import type { GameState } from "../sim/game-state";
import { setFill } from "./paint";
import { TEXTURE_KEYS } from "./texture-keys";

const SCREEN = {
  damage: { alpha: 0.14, color: "#c0392b", threshold: 30 },
  freeze: { alpha: 0.09, color: "#4682c8" },
  levelFlash: { alpha: 0.3, color: "#9b59b6", ticks: 30 },
};
const FIXED = 0;
const ORIGIN = 0;
const NONE = 0;

/** Screen-space vignette plus level-up, damage and freeze tints. */
export class ScreenEffects {
  private countTints = NONE;

  private readonly size: Readonly<{ height: number; width: number }>;

  private readonly tint: Phaser.GameObjects.Graphics;

  public constructor(
    scene: Phaser.Scene,
    size: Readonly<{ height: number; width: number }>,
  ) {
    this.size = size;
    scene.add
      .image(ORIGIN, ORIGIN, TEXTURE_KEYS.vignette)
      .setOrigin(ORIGIN)
      .setScrollFactor(FIXED)
      .setDepth(DEPTHS.screen);
    this.tint = scene.add
      .graphics()
      .setScrollFactor(FIXED)
      .setDepth(DEPTHS.screen);
  }

  private fillScreen(paint: Readonly<{ alpha: number; color: string }>): void {
    setFill(this.tint, paint);
    this.tint.fillRect(ORIGIN, ORIGIN, this.size.width, this.size.height);
  }

  /** Number of tints drawn in the last update. */
  public get activeTints(): number {
    return this.countTints;
  }

  /** Draws the tints that apply to the current state. */
  public update(state: GameState): void {
    const tints = [
      state.progress.levelFlashTicks > NONE
        ? {
            alpha:
              (state.progress.levelFlashTicks / SCREEN.levelFlash.ticks) *
              SCREEN.levelFlash.alpha,
            color: SCREEN.levelFlash.color,
          }
        : null,
      state.player.invulnerableTicks > SCREEN.damage.threshold
        ? SCREEN.damage
        : null,
      state.progress.freezeTicks > NONE ? SCREEN.freeze : null,
    ].filter((paint) => paint !== null);

    this.tint.clear();
    this.countTints = tints.length;

    for (const paint of tints) {
      this.fillScreen(paint);
    }
  }
}
