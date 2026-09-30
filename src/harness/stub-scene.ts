import * as Phaser from "phaser";

/** Creates an empty scene class with the given key (stand-in for navigation targets). */
export const createStubScene = (key: string): Phaser.Types.Scenes.SceneType =>
  class extends Phaser.Scene {
    public constructor() {
      super(key);
    }
  };
