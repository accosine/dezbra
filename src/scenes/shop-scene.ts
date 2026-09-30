import * as Phaser from "phaser";
import { addCaption, addHeading, addIcon } from "../ui/screen-text";
import { BUTTON_COLORS, createButton } from "../ui/button";
import { canPurchase, hasShopItem, purchaseShopItem } from "../save/shop";
import { createTextStyle, FONT_SIZE } from "../ui/text-style";
import { readSave, updateSave } from "./game-registry";
import { SHOP_ITEMS, type ShopItemDefinition } from "../data/shop-items";
import { createCard } from "../ui/card";
import { GAME_WIDTH } from "../constants";
import type { SaveData } from "../save/save-data";
import { SCENE_KEYS } from "./scene-keys";
import { showBanner } from "../ui/banner";

const SHOP = {
  backY: 790,
  card: {
    gap: 8,
    height: 78,
    iconX: 32,
    left: 10,
    textX: 64,
    top: 150,
    width: 410,
  },
  coinsY: 110,
  lockedAlpha: 0.4,
  ownedAlpha: 0.65,
  subtitleY: 70,
  titleY: 40,
};
const GOLD = "#f1c40f";
const GREEN = "#27ae60";
const HALF = 0.5;
const OPAQUE = 1;
const LINE = { description: 24, name: 10, price: 50 };

const describePrice = (
  save: SaveData,
  item: ShopItemDefinition,
): Readonly<{ color: string; text: string }> =>
  hasShopItem(save, item.id)
    ? { color: GREEN, text: "✓ BEREITS GEKAUFT" }
    : { color: GOLD, text: `🪙 ${item.price} MÜNZEN` };

const pickCardAlpha = (save: SaveData, item: ShopItemDefinition): number => {
  if (hasShopItem(save, item.id)) {
    return SHOP.ownedAlpha;
  }

  return canPurchase(save, item) ? OPAQUE : SHOP.lockedAlpha;
};

/** Permanent upgrades bought with coins earned in runs. */
export class ShopScene extends Phaser.Scene {
  public constructor() {
    super(SCENE_KEYS.shop);
  }

  private addItemCard(
    save: SaveData,
    item: ShopItemDefinition,
    index: number,
  ): void {
    const { card } = SHOP;
    const container = createCard(this, {
      border: hasShopItem(save, item.id) ? GREEN : "#2a2a3a",
      fill: "#06060e",
      height: card.height,
      width: card.width,
      x: card.left,
      y: card.top + index * (card.height + card.gap),
      ...(canPurchase(save, item) && { onPress: (): void => this.buy(item) }),
    });

    container
      .add([...this.createItemContent(save, item)])
      .setAlpha(pickCardAlpha(save, item));
  }

  private buy(item: ShopItemDefinition): void {
    updateSave(this.registry, (save) => purchaseShopItem(save, item.id));
    this.children.removeAll(true);
    this.render();
    showBanner(this, "✓ GEKAUFT!", { color: GREEN });
  }

  private createItemContent(
    save: SaveData,
    item: ShopItemDefinition,
  ): ReadonlyArray<Phaser.GameObjects.Text> {
    const { card } = SHOP;
    const price = describePrice(save, item);
    const descriptionStyle = createTextStyle({
      color: "#888888",
      size: FONT_SIZE.small,
      wrapWidth: card.width - card.textX - card.left,
    });

    return [
      addIcon(
        this,
        { size: FONT_SIZE.title, x: card.iconX, y: card.height * HALF },
        item.icon,
      ),
      this.add.text(
        card.textX,
        LINE.name,
        item.name,
        createTextStyle({ color: "#ffffff", size: FONT_SIZE.medium }),
      ),
      this.add.text(
        card.textX,
        LINE.description,
        item.description,
        descriptionStyle,
      ),
      this.add.text(
        card.textX,
        LINE.price,
        price.text,
        createTextStyle({ color: price.color, size: FONT_SIZE.small }),
      ),
    ];
  }

  private render(): void {
    const save = readSave(this.registry);

    addHeading(this, {
      color: GOLD,
      text: "🛒 PERMANENTER SHOP",
      y: SHOP.titleY,
    });
    addCaption(this, {
      color: "#555555",
      text: "MÜNZEN BLEIBEN NACH JEDEM RUN",
      y: SHOP.subtitleY,
    });
    addCaption(this, {
      color: GOLD,
      size: FONT_SIZE.medium,
      text: `🪙 ${save.coins} MÜNZEN`,
      y: SHOP.coinsY,
    });
    for (const [index, item] of SHOP_ITEMS.entries()) {
      this.addItemCard(save, item, index);
    }
    createButton(this, {
      colors: BUTTON_COLORS.red,
      label: "← ZURÜCK",
      onPress: (): void => {
        this.scene.start(SCENE_KEYS.menu);
      },
      width: SHOP.card.width - SHOP.card.left - SHOP.card.left,
      x: GAME_WIDTH * HALF,
      y: SHOP.backY,
    });
  }

  public create(): void {
    this.cameras.main.setBackgroundColor("#03030c");
    this.render();
  }
}
