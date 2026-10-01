import type * as Phaser from "phaser";
import { createIconStyle, createTextStyle, FONT_SIZE } from "../ui/text-style";
import { isFusionWeapon, WEAPONS } from "../data/weapons";
import { GAME_WIDTH } from "../constants";
import { hexToNumber } from "../utils/color";
import type { WeaponSlot } from "../sim/entities";

const SLOT = {
  background: "#040412",
  border: "#2a2a3a",
  borderWidth: 2,
  depth: 30,
  fusionBorder: "#ffd700",
  gap: 5,
  iconSize: 16,
  inset: 2,
  size: 38,
  top: 612,
};
const HALF = 0.5;
const BOTTOM_RIGHT = 1;
const BACKGROUND_ALPHA = 0.92;
const FUSION_MARK = "★";
const NONE = 0;

/** Width of a weapon bar with the given number of slots. */
export const measureWeaponBar = (count: number): number =>
  count * SLOT.size + Math.max(count - BOTTOM_RIGHT, NONE) * SLOT.gap;

/** Row of equipped weapons with their level (★ for fusions). */
export class WeaponBar {
  private readonly frames: Phaser.GameObjects.Graphics;

  private readonly scene: Phaser.Scene;

  private signature = "";

  private readonly texts: Array<Phaser.GameObjects.Text> = [];

  public constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.frames = scene.add.graphics().setDepth(SLOT.depth);
  }

  private addSlot(slot: WeaponSlot, left: number): void {
    const weapon = WEAPONS[slot.id];
    const isFusion = isFusionWeapon(weapon);

    this.frames.fillStyle(hexToNumber(SLOT.background), BACKGROUND_ALPHA);
    this.frames.fillRect(left, SLOT.top, SLOT.size, SLOT.size);
    this.frames.lineStyle(
      SLOT.borderWidth,
      hexToNumber(SLOT[isFusion ? "fusionBorder" : "border"]),
    );
    this.frames.strokeRect(left, SLOT.top, SLOT.size, SLOT.size);
    this.texts.push(
      this.scene.add
        .text(
          left + SLOT.size * HALF,
          SLOT.top + SLOT.size * HALF,
          weapon.icon,
          createIconStyle(SLOT.iconSize),
        )
        .setOrigin(HALF)
        .setDepth(SLOT.depth),
      this.scene.add
        .text(
          left + SLOT.size - SLOT.inset,
          SLOT.top + SLOT.size - SLOT.inset,
          isFusion ? FUSION_MARK : String(slot.level),
          createTextStyle({ color: "#ffd700", size: FONT_SIZE.small }),
        )
        .setOrigin(BOTTOM_RIGHT)
        .setDepth(SLOT.depth),
    );
  }

  private clear(): void {
    this.frames.clear();

    for (const text of this.texts) {
      text.destroy();
    }

    this.texts.length = NONE;
  }

  /** Rebuilds the bar when the equipped weapons changed. */
  public update(weapons: ReadonlyArray<WeaponSlot>): void {
    const signature = weapons
      .map((slot) => `${slot.id}:${slot.level}`)
      .join(",");

    if (signature === this.signature) {
      return;
    }

    this.signature = signature;
    this.clear();

    const start = (GAME_WIDTH - measureWeaponBar(weapons.length)) * HALF;

    for (const [index, slot] of weapons.entries()) {
      this.addSlot(slot, start + index * (SLOT.size + SLOT.gap));
    }
  }
}
