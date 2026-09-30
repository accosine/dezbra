import * as Phaser from "phaser";
import { addCaption, addHeading } from "../ui/screen-text";
import {
  addChoiceCard,
  type ChoiceCard,
  placeChoiceCard,
} from "./overlay-cards";
import { hexToNumber } from "../utils/color";
import { PlayScene } from "./play-scene";
import type { Rarity } from "../data/perks";
import { SCENE_KEYS } from "./scene-keys";
import type { UpgradeOffer } from "../sim/upgrade-offers";
import { WEAPONS } from "../data/weapons";

const RARITY_STYLES: Readonly<
  Record<Rarity, Readonly<{ border: string; color: string; label: string }>>
> = {
  common: { border: "#4a4a5a", color: "#777777", label: "GEWÖHNLICH" },
  epic: { border: "#7d3c98", color: "#9b59b6", label: "EPISCH" },
  fusion: { border: "#00d4ff", color: "#00d4ff", label: "FUSION" },
  legendary: { border: "#d4ac0d", color: "#f1c40f", label: "LEGENDÄR" },
  rare: { border: "#2e86c1", color: "#3498db", label: "SELTEN" },
};
const BADGES: Readonly<
  Record<UpgradeOffer["kind"], Readonly<{ color: string; text: string }>>
> = {
  extraWeapon: { color: "#ff9900", text: "★ WAFFE" },
  fusion: { color: "#00d4ff", text: "⚗ FUSION" },
  perk: { color: "#85c1e9", text: "◆ PERK" },
  weaponLevel: { color: "#ff9900", text: "★ WAFFE" },
};
const LAYOUT = { subtitleY: 72, titleY: 40 };
const GOLD = "#f1c40f";
const BACKDROP = { alpha: 0.96, color: "#02020a" };
const ORIGIN = 0;

const describeFusion = (offer: UpgradeOffer): string | null => {
  if (offer.kind !== "fusion") {
    return null;
  }

  const recipe = WEAPONS[offer.weaponId].recipe ?? [];

  return `⚗ ${recipe.map((ingredient) => `${WEAPONS[ingredient].icon}${WEAPONS[ingredient].name}`).join(" + ")}`;
};

/** Turns an offer into a choice card. */
export const describeOffer = (offer: UpgradeOffer): ChoiceCard => {
  const style = RARITY_STYLES[offer.rarity];

  return {
    badge: BADGES[offer.kind],
    border: style.border,
    description: offer.description,
    hint: describeFusion(offer),
    icon: offer.icon,
    label: { color: style.color, text: style.label },
    name: offer.name,
  };
};

/** Level-up overlay with three offers; the game is paused meanwhile. */
export class UpgradeScene extends Phaser.Scene {
  public constructor() {
    super(SCENE_KEYS.upgrade);
  }

  private choose(play: PlayScene, offer: UpgradeOffer): void {
    play.chooseUpgrade(offer);
    this.children.removeAll(true);

    if (play.pendingUpgrades.length === ORIGIN) {
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
      text: `LEVEL ${play.level}!`,
      y: LAYOUT.titleY,
    });
    addCaption(this, {
      color: "#555555",
      text: "◆ WÄHLE DEIN UPGRADE ◆",
      y: LAYOUT.subtitleY,
    });
    for (const [index, offer] of play.pendingUpgrades.entries()) {
      addChoiceCard(this, describeOffer(offer), {
        onPress: (): void => {
          this.choose(play, offer);
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
