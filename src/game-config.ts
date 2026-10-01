import * as Phaser from "phaser";
import { BACKGROUND_COLOR, GAME_HEIGHT, GAME_WIDTH } from "./constants";
import { BootScene } from "./scenes/boot-scene";
import { CharacterSelectScene } from "./scenes/character-select-scene";
import { ChestScene } from "./scenes/chest-scene";
import { GameOverScene } from "./scenes/game-over-scene";
import { HudScene } from "./scenes/hud-scene";
import { MapSelectScene } from "./scenes/map-select-scene";
import { MenuScene } from "./scenes/menu-scene";
import { PlayScene } from "./scenes/play-scene";
import { ShopScene } from "./scenes/shop-scene";
import { UpgradeScene } from "./scenes/upgrade-scene";

const TOUCHES = 2;

/** Creates the Phaser game configuration for a DOM parent element ID. */
export const createGameConfig = (
  parent: string,
): Phaser.Types.Core.GameConfig => ({
  backgroundColor: BACKGROUND_COLOR,
  input: { activePointers: TOUCHES },
  parent,
  pixelArt: true,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
    height: GAME_HEIGHT,
    mode: Phaser.Scale.FIT,
    width: GAME_WIDTH,
  },
  scene: [
    BootScene,
    MenuScene,
    CharacterSelectScene,
    MapSelectScene,
    ShopScene,
    PlayScene,
    HudScene,
    UpgradeScene,
    ChestScene,
    GameOverScene,
  ],
  type: Phaser.AUTO,
});
