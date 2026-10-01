import * as Phaser from "phaser";
import { BACKGROUND_COLOR, GAME_HEIGHT, GAME_WIDTH } from "./constants";
import { describe, expect, it } from "vitest";
import { BootScene } from "./scenes/boot-scene";
import { createGameConfig } from "./game-config";
import { GameOverScene } from "./scenes/game-over-scene";

const TOUCHES = 2;
const FIRST = 0;

describe("createGameConfig", (): void => {
  it("mounts a pixel-art portrait game into the parent", (): void => {
    // Arrange
    const gameParent = "game";

    // Act
    const gameConfig = createGameConfig(gameParent);

    // Assert
    expect(gameConfig).toMatchObject({
      backgroundColor: BACKGROUND_COLOR,
      input: { activePointers: TOUCHES },
      parent: gameParent,
      pixelArt: true,
      scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        height: GAME_HEIGHT,
        mode: Phaser.Scale.FIT,
        width: GAME_WIDTH,
      },
      type: Phaser.AUTO,
    });
  });

  it("starts with the boot scene and registers every screen", (): void => {
    const { scene } = createGameConfig("game");

    expect(Array.isArray(scene) ? scene.at(FIRST) : scene).toBe(BootScene);
    expect(Array.isArray(scene) && scene.includes(GameOverScene)).toBe(true);
  });
});
