import * as Phaser from "phaser";
import { addCaption, addHeading } from "../ui/screen-text";
import {
  addChoiceCard,
  type ChoiceCard,
  placeChoiceCard,
} from "./overlay-cards";
import type { LootDefinition, LootTier } from "../data/loot";
import { hexToNumber } from "../utils/color";
import { PlayScene } from "./play-scene";
import { SCENE_KEYS } from "./scene-keys";

const TIER_BORDERS: Readonly<Record<LootTier, string>> = {
  blue: "#2e86c1",
  gold: "#d4ac0d",
  purple: "#7d3c98",
  red: "#c0392b",
};
const LAYOUT = { subtitleY: 72, titleY: 40 };
const BACKDROP = { alpha: 0.96, color: "#02020a" };
const GOLD = "#ffd700";
const ORIGIN = 0;

/** Turns a chest reward into a choice card. */
export const describeLoot = (loot: LootDefinition): ChoiceCard => ({
  badge: null,
  border: TIER_BORDERS[loot.tier],
  description: loot.description,
  hint: null,
  icon: loot.icon,
  label: null,
  name: loot.name,
});

/** Boss chest overlay with three rewards; the game is paused meanwhile. */
export class ChestScene extends Phaser.Scene {
  public constructor() {
    super(SCENE_KEYS.chest);
  }

  private choose(play: PlayScene, loot: LootDefinition): void {
    play.chooseLoot(loot.id);
    this.children.removeAll(true);

    if (play.pendingLoot.length === ORIGIN) {
      this.scene.stop();
    } else {
      this.render(play);
    }
  }

  private render(play: PlayScene): void {
    this.add
      .rectangle(
        ORIGIN,
        ORIGIN,
        this.scale.width,
        this.scale.height,
        hexToNumber(BACKDROP.color),
        BACKDROP.alpha,
      )
      .setOrigin(ORIGIN);
    addHeading(this, {
      color: GOLD,
      text: "🎁 SCHATZTRUHE!",
      y: LAYOUT.titleY,
    });
    addCaption(this, {
      color: "#555555",
      text: "DER BOSS HAT ETWAS HINTERLASSEN",
      y: LAYOUT.subtitleY,
    });
    for (const [index, loot] of play.pendingLoot.entries()) {
      addChoiceCard(this, describeLoot(loot), {
        onPress: (): void => {
          this.choose(play, loot);
        },
        y: placeChoiceCard(index),
      });
    }
  }

  public create(): void {
    const play = this.scene.get(SCENE_KEYS.play);

    if (play instanceof PlayScene) {
      this.render(play);
    }
  }
}
