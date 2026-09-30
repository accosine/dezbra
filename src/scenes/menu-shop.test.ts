import { afterEach, describe, expect, it } from "vitest";
import {
  press,
  readTexts,
  requireScene,
  startScene,
  useGame,
  waitUntil,
} from "../harness/phaser-harness";
import { readSave, writeSave } from "./game-registry";
import { createStubScene } from "../harness/stub-scene";
import { DEFAULT_SAVE_DATA } from "../save/save-data";
import { MenuScene } from "./menu-scene";
import { SCENE_KEYS } from "./scene-keys";
import { ShopScene } from "./shop-scene";

const getGame = useGame([
  createStubScene("idle"),
  MenuScene,
  ShopScene,
  createStubScene(SCENE_KEYS.characterSelect),
]);
const RICH = { ...DEFAULT_SAVE_DATA, coins: 500 };
const ARMOR_PRICE = 150;
const PULSE_TIME = 1000;

afterEach((): void => {
  localStorage.clear();
});

describe("MenuScene", (): void => {
  it("shows the title and starts the character selection", async (): Promise<void> => {
    const game = getGame();

    await startScene(game, SCENE_KEYS.menu);

    const menu = requireScene(game, SCENE_KEYS.menu, MenuScene);

    menu.update(PULSE_TIME);
    expect(readTexts(menu)).toEqual(
      expect.arrayContaining(["DEAD\nPIXELS", "▶ SPIELEN", "🛒 SHOP"]),
    );
    press(menu, "▶ SPIELEN");
    await waitUntil(() => game.scene.isActive(SCENE_KEYS.characterSelect));
  });

  it("opens the shop", async (): Promise<void> => {
    const game = getGame();

    await startScene(game, SCENE_KEYS.menu);
    press(requireScene(game, SCENE_KEYS.menu, MenuScene), "🛒 SHOP");
    await waitUntil(() => game.scene.isActive(SCENE_KEYS.shop));
  });
});

describe("ShopScene", (): void => {
  it("buys an affordable item and shows it as owned", async (): Promise<void> => {
    const game = getGame();

    writeSave(game.registry, RICH);
    await startScene(game, SCENE_KEYS.shop);

    const shop = requireScene(game, SCENE_KEYS.shop, ShopScene);

    press(shop, "STARTPANZERUNG");

    expect(readSave(game.registry)).toMatchObject({
      coins: RICH.coins - ARMOR_PRICE,
      purchasedItems: ["startArmor"],
    });
    expect(readTexts(shop)).toEqual(
      expect.arrayContaining(["✓ BEREITS GEKAUFT", "✓ GEKAUFT!"]),
    );
  });

  it("does not sell unaffordable items and leads back to the menu", async (): Promise<void> => {
    const game = getGame();

    writeSave(game.registry, DEFAULT_SAVE_DATA);
    await startScene(game, SCENE_KEYS.shop);

    const shop = requireScene(game, SCENE_KEYS.shop, ShopScene);

    expect(() => {
      press(shop, "PHÖNIX");
    }).toThrow(Error);
    press(shop, "← ZURÜCK");
    await waitUntil(() => game.scene.isActive(SCENE_KEYS.menu));
  });
});
