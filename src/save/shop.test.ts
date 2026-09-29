import { canPurchase, hasShopItem, purchaseShopItem } from "./shop";
import { describe, expect, it } from "vitest";
import { DEFAULT_SAVE_DATA } from "./save-data";
import { SHOP_ITEMS } from "../data/shop-items";

const RICH_SAVE = { ...DEFAULT_SAVE_DATA, coins: 500 };
const POOR_SAVE = { ...DEFAULT_SAVE_DATA, coins: 10 };
const ARMOR_PRICE =
  SHOP_ITEMS.find((item) => item.id === "startArmor")?.price ?? NaN;

describe("shop", (): void => {
  it("buys an affordable item", (): void => {
    const save = purchaseShopItem(RICH_SAVE, "startArmor");

    expect(hasShopItem(save, "startArmor")).toBe(true);
    expect(save.coins).toBe(RICH_SAVE.coins - ARMOR_PRICE);
  });

  it("does not buy the same item twice", (): void => {
    const save = purchaseShopItem(RICH_SAVE, "startArmor");

    expect(purchaseShopItem(save, "startArmor")).toBe(save);
  });

  it("refuses items the player cannot afford", (): void => {
    expect(purchaseShopItem(POOR_SAVE, "startArmor")).toBe(POOR_SAVE);
    expect(SHOP_ITEMS.some((item) => canPurchase(POOR_SAVE, item))).toBe(false);
  });
});
