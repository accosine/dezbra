import {
  SHOP_ITEMS,
  type ShopItemDefinition,
  type ShopItemId,
} from "../data/shop-items";
import type { SaveData } from "./save-data";

/** Returns true if the item was bought before. */
export const hasShopItem = (save: SaveData, itemId: ShopItemId): boolean =>
  save.purchasedItems.includes(itemId);

/** Returns true if the item is not owned yet and affordable. */
export const canPurchase = (
  save: SaveData,
  item: ShopItemDefinition,
): boolean => !hasShopItem(save, item.id) && save.coins >= item.price;

/** Buys the item; an unknown, owned or unaffordable item leaves the save unchanged. */
export const purchaseShopItem = (
  save: SaveData,
  itemId: ShopItemId,
): SaveData => {
  const item = SHOP_ITEMS.find((candidate) => candidate.id === itemId);

  if (item === undefined || !canPurchase(save, item)) {
    return save;
  }

  return {
    ...save,
    coins: save.coins - item.price,
    purchasedItems: [...save.purchasedItems, item.id],
  };
};
