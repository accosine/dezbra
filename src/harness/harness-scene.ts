import * as Phaser from "phaser";

/** Key of the empty scene used to test game objects in isolation. */
export const HARNESS_SCENE_KEY = "harness";

/** An empty scene that tests fill with the objects under test. */
export class HarnessScene extends Phaser.Scene {
  public constructor() {
    super(HARNESS_SCENE_KEY);
  }
}
