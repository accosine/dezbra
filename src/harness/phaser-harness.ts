import * as Phaser from "phaser";
import { afterAll, beforeAll } from "vitest";
import { GAME_HEIGHT, GAME_WIDTH } from "../constants";
import { HARNESS_SCENE_KEY, HarnessScene } from "./harness-scene";

const HARNESS_PARENT_ID = "harness-game";
const FRAME_MILLISECONDS = 16;
const FIRST_FRAME = 1;

/** Boots a Phaser game with the given scenes and resolves once it is ready. */
export const bootGame = async (
  scenes: ReadonlyArray<Phaser.Types.Scenes.SceneType>,
): Promise<Phaser.Game> => {
  const parent = document.createElement("div");
  parent.id = HARNESS_PARENT_ID;
  document.body.append(parent);

  const game = new Phaser.Game({
    audio: { noAudio: true },
    banner: false,
    height: GAME_HEIGHT,
    parent: HARNESS_PARENT_ID,
    scene: [...scenes],
    type: Phaser.AUTO,
    width: GAME_WIDTH,
  });

  await new Promise<void>((resolve): void => {
    game.events.once(Phaser.Core.Events.READY, (): void => {
      resolve();
    });
  });

  return game;
};

/** Destroys the game and removes its DOM parent. */
export const destroyGame = (game: Phaser.Game): void => {
  game.destroy(true);
  document.querySelector(`#${HARNESS_PARENT_ID}`)?.remove();
};

/** Runs the given number of game frames synchronously. */
export const stepFrames = (game: Phaser.Game, frames: number): void => {
  for (let frame = FIRST_FRAME; frame <= frames; frame += FIRST_FRAME) {
    game.step(game.loop.now + frame * FRAME_MILLISECONDS, FRAME_MILLISECONDS);
  }
};

/** Returns the scene with the key once it has been created (starting it if needed). */
export const requireScene = <SceneClass extends Phaser.Scene>(
  game: Phaser.Game,
  key: string,
  sceneClass: abstract new (...parameters: never[]) => SceneClass,
): SceneClass => {
  const scene = game.scene.getScene(key);

  if (!(scene instanceof sceneClass)) {
    throw new TypeError(`Scene ${key} is not a ${sceneClass.name}.`);
  }

  return scene;
};

const collectTexts = (
  child: Phaser.GameObjects.GameObject,
): ReadonlyArray<Phaser.GameObjects.Text> => {
  if (child instanceof Phaser.GameObjects.Text) {
    return [child];
  }

  return child instanceof Phaser.GameObjects.Container
    ? child.list.flatMap((nested) => collectTexts(nested))
    : [];
};

/** Lists all text objects of a scene. */
export const listTexts = (
  scene: Phaser.Scene,
): ReadonlyArray<Phaser.GameObjects.Text> =>
  scene.children.list.flatMap((child) => collectTexts(child));

/** Returns the visible text strings of a scene. */
export const readTexts = (scene: Phaser.Scene): ReadonlyArray<string> =>
  listTexts(scene)
    .filter((text) => text.visible)
    .map((text) => text.text);

/** Snapshots a graphics object into a texture and returns the color at a point. */
export const samplePixel = (
  graphics: Phaser.GameObjects.Graphics,
  size: Readonly<{ height: number; width: number }>,
  point: Readonly<{ x: number; y: number }>,
): Phaser.Display.Color => {
  const key = `sample-${graphics.scene.textures.getTextureKeys().length}`;

  graphics.generateTexture(key, size.width, size.height);

  const color = graphics.scene.textures.getPixel(point.x, point.y, key);

  if (color === null) {
    throw new Error(`No pixel at ${point.x},${point.y}.`);
  }

  return color;
};

/** Creates a real pointer at the given screen position. */
export const createPointer = (
  scene: Phaser.Scene,
  position: Readonly<{ x: number; y: number }>,
): Phaser.Input.Pointer => {
  const pointer = new Phaser.Input.Pointer(scene.input.manager, FIRST_FRAME);

  pointer.x = position.x;
  pointer.y = position.y;

  return pointer;
};

/** Boots one game with the empty harness scene for a test file and returns an accessor. */
export const useHarnessScene = (): (() => HarnessScene) => {
  let game: Phaser.Game | null = null;

  beforeAll(async (): Promise<void> => {
    game = await bootGame([HarnessScene]);
  });

  afterAll((): void => {
    if (game !== null) {
      destroyGame(game);
    }
  });

  return (): HarnessScene => {
    if (game === null) {
      throw new Error("The harness game has not booted yet.");
    }

    return requireScene(game, HARNESS_SCENE_KEY, HarnessScene);
  };
};
