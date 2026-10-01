import * as Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../constants";
import { getBrowserStorage, loadSaveData } from "../save/save-storage";
import { createGameTextures } from "../render/game-textures";
import { FONT_FAMILY } from "../ui/text-style";
import { SCENE_KEYS } from "./scene-keys";
import { writeSave } from "./game-registry";

const FONT_PROBE = `8px ${FONT_FAMILY}`;

const waitForFont = async (): Promise<void> => {
  try {
    await document.fonts.load(FONT_PROBE);
  } catch {
    // The fallback font is fine when the pixel font cannot load
  }
};

/** Loads the progress, bakes all textures and waits for the pixel font. */
export class BootScene extends Phaser.Scene {
  public constructor() {
    super(SCENE_KEYS.boot);
  }

  public async create(): Promise<void> {
    writeSave(this.registry, loadSaveData(getBrowserStorage()));
    createGameTextures(this, { height: GAME_HEIGHT, width: GAME_WIDTH });
    await waitForFont();
    this.scene.start(SCENE_KEYS.menu);
  }
}
