import * as Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "./constants";
import { MainScene } from "./main-scene";

/** Creates the Phaser game configuration for a DOM parent element ID. */
export const createGameConfig = (
  parent: string,
): Phaser.Types.Core.GameConfig => ({
  height: GAME_HEIGHT,
  parent,
  scene: [MainScene],
  type: Phaser.AUTO,
  width: GAME_WIDTH,
});
