import * as Phaser from "phaser";
import { describe, expect, it } from "vitest";
import { GAME_HEIGHT, GAME_WIDTH } from "./constants";
import { createGameConfig } from "./game-config";
import { MainScene } from "./main-scene";

describe("createGameConfig", (): void => {
  it("creates the Phaser game configuration", (): void => {
    const gameParent = "game";

    const gameConfig = createGameConfig(gameParent);

    expect(gameConfig.height).toBe(GAME_HEIGHT);
    expect(gameConfig.parent).toBe(gameParent);
    expect(gameConfig.scene).toEqual([MainScene]);
    expect(gameConfig.type).toBe(Phaser.AUTO);
    expect(gameConfig.width).toBe(GAME_WIDTH);
  });
});
