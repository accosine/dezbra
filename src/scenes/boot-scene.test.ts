import { bootGame, destroyGame, waitUntil } from "../harness/phaser-harness";
import { describe, expect, it, vi } from "vitest";
import { BootScene } from "./boot-scene";
import { createStubScene } from "../harness/stub-scene";
import { DEFAULT_SAVE_DATA } from "../save/save-data";
import { readSave } from "./game-registry";
import { SAVE_STORAGE_KEY } from "../save/save-storage";
import { SCENE_KEYS } from "./scene-keys";
import { TEXTURE_KEYS } from "../render/texture-keys";

const STORED = { ...DEFAULT_SAVE_DATA, coins: 42 };

describe("BootScene", (): void => {
  it("loads the progress, bakes textures and opens the menu", async (): Promise<void> => {
    localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(STORED));

    const game = await bootGame([BootScene, createStubScene(SCENE_KEYS.menu)]);

    await waitUntil(() => game.scene.isActive(SCENE_KEYS.menu));
    expect(readSave(game.registry).coins).toBe(STORED.coins);
    expect(game.textures.exists(TEXTURE_KEYS.vignette)).toBe(true);
    destroyGame(game);
    localStorage.clear();
  });

  it("still opens the menu when the font cannot load", async (): Promise<void> => {
    const failing = vi
      .spyOn(document.fonts, "load")
      .mockRejectedValue(new Error("offline"));
    const game = await bootGame([BootScene, createStubScene(SCENE_KEYS.menu)]);

    await waitUntil(() => game.scene.isActive(SCENE_KEYS.menu));
    expect(failing).toHaveBeenCalled();
    failing.mockRestore();
    destroyGame(game);
  });
});
