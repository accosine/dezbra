import * as Phaser from "phaser";
import { afterEach, describe, expect, it } from "vitest";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  LOGO_ORIGIN,
  LOGO_TWEEN_DURATION,
  LOGO_TWEEN_PROPERTY,
  LOGO_TWEEN_REPEAT,
  LOGO_TWEEN_TARGET_Y,
  LOGO_X,
  LOGO_Y,
  POINTER_CIRCLE_ALPHA,
  POINTER_CIRCLE_FILL_COLOR,
  POINTER_CIRCLE_RADIUS,
  TITLE_X,
  TITLE_Y,
} from "./constants";
import { MainScene } from "./main-scene";

const FIRST_CREATED_OBJECT_INDEX = 0;
const POINTER_X_PROPERTY = "x";
const POINTER_Y_PROPERTY = "y";
const POINTER_TEST_X = 120;
const POINTER_TEST_Y = 160;
const TEST_GAME_PARENT = "test-game";
const TWEEN_TARGET_COUNT = 1;
const TWEEN_TARGET_INDEX = 0;

let activeGame: Phaser.Game | null = null;

const requireDefined = <T>(candidate: T | undefined, message: string): T => {
  expect(candidate).toBeDefined();

  if (candidate === undefined) {
    throw new Error(message);
  }

  return candidate;
};

const isTextGameObject = (
  gameObject: Phaser.GameObjects.GameObject,
): gameObject is Phaser.GameObjects.Text =>
  gameObject instanceof Phaser.GameObjects.Text;

const isArcGameObject = (
  gameObject: Phaser.GameObjects.GameObject,
): gameObject is Phaser.GameObjects.Arc =>
  gameObject instanceof Phaser.GameObjects.Arc;

const isTweenData = (
  tweenEntry: Phaser.Tweens.Tween | Phaser.Tweens.TweenData,
): tweenEntry is Phaser.Tweens.TweenData =>
  tweenEntry instanceof Phaser.Tweens.TweenData;

const createTestParent = (): HTMLDivElement => {
  const testParent = document.createElement("div");
  testParent.id = TEST_GAME_PARENT;
  document.body.append(testParent);

  return testParent;
};

const createStartedScene = (): Promise<MainScene> => {
  createTestParent();

  const testGame = new Phaser.Game({
    height: GAME_HEIGHT,
    parent: TEST_GAME_PARENT,
    scene: [MainScene],
    type: Phaser.AUTO,
    width: GAME_WIDTH,
  });
  activeGame = testGame;

  return new Promise<MainScene>((resolve, reject): void => {
    testGame.events.once("ready", (): void => {
      const mainScene = testGame.scene.getScene("main-scene");

      if (mainScene instanceof MainScene) {
        resolve(mainScene);
        return;
      }

      reject(new Error("Expected main scene to start."));
    });
  });
};

const getTextObjects = (
  scene: Phaser.Scene,
): ReadonlyArray<Phaser.GameObjects.Text> =>
  scene.children.list.filter(isTextGameObject);

const getCircleObjects = (
  scene: Phaser.Scene,
): ReadonlyArray<Phaser.GameObjects.Arc> =>
  scene.children.list.filter(isArcGameObject);

const findSceneText = (
  scene: Phaser.Scene,
  expectedText: string,
): Phaser.GameObjects.Text =>
  requireDefined(
    getTextObjects(scene).find(
      (textObject): boolean => textObject.text === expectedText,
    ),
    `Expected ${expectedText} text to exist.`,
  );

const assertTitleText = (mainScene: MainScene): void => {
  const titleText = findSceneText(mainScene, "Phaser 4 + Vite + TypeScript");

  expect(titleText.x).toBe(TITLE_X);
  expect(titleText.y).toBe(TITLE_Y);
};

const assertLogoText = (logoText: Phaser.GameObjects.Text): void => {
  expect(logoText.x).toBe(LOGO_X);
  expect(logoText.y).toBe(LOGO_Y);
  expect(logoText.originX).toBe(LOGO_ORIGIN);
  expect(logoText.originY).toBe(LOGO_ORIGIN);
};

const assertLogoTween = (
  mainScene: MainScene,
  logoText: Phaser.GameObjects.Text,
): void => {
  const activeTween = requireDefined(
    mainScene.tweens.getTweensOf(logoText).at(FIRST_CREATED_OBJECT_INDEX),
    "Expected logo tween to exist.",
  );
  const activeTweenEntry = requireDefined(
    activeTween.data.at(FIRST_CREATED_OBJECT_INDEX),
    "Expected logo tween data to exist.",
  );

  if (!isTweenData(activeTweenEntry)) {
    throw new Error("Expected logo tween entry to be TweenData.");
  }

  expect(activeTweenEntry.duration).toBe(LOGO_TWEEN_DURATION);
  expect(activeTweenEntry.key).toBe(LOGO_TWEEN_PROPERTY);
  expect(activeTweenEntry.repeat).toBe(LOGO_TWEEN_REPEAT);
  expect(activeTweenEntry.yoyo).toBe(true);
  expect(
    activeTweenEntry.getEndValue(
      logoText,
      LOGO_TWEEN_PROPERTY,
      LOGO_Y,
      TWEEN_TARGET_INDEX,
      TWEEN_TARGET_COUNT,
      activeTween,
    ),
  ).toBe(LOGO_TWEEN_TARGET_Y);
};

const emitPointerDown = (mainScene: MainScene): void => {
  mainScene.input.emit("pointerdown", {
    [POINTER_X_PROPERTY]: POINTER_TEST_X,
    [POINTER_Y_PROPERTY]: POINTER_TEST_Y,
  });
};

const assertPointerMarker = (mainScene: MainScene): void => {
  const pointerMarker = requireDefined(
    getCircleObjects(mainScene).at(FIRST_CREATED_OBJECT_INDEX),
    "Expected pointer marker to exist.",
  );

  expect(pointerMarker.x).toBe(POINTER_TEST_X);
  expect(pointerMarker.y).toBe(POINTER_TEST_Y);
  expect(pointerMarker.radius).toBe(POINTER_CIRCLE_RADIUS);
  expect(pointerMarker.fillColor).toBe(POINTER_CIRCLE_FILL_COLOR);
  expect(pointerMarker.alpha).toBe(POINTER_CIRCLE_ALPHA);
};

afterEach((): void => {
  activeGame?.destroy(true);
  activeGame = null;
  document.querySelector(`#${TEST_GAME_PARENT}`)?.remove();
});

describe("MainScene", (): void => {
  it("renders the title text", async (): Promise<void> => {
    assertTitleText(await createStartedScene());
  });

  it("renders the logo text with the configured tween", async (): Promise<void> => {
    const mainScene = await createStartedScene();
    const logoText = findSceneText(mainScene, "🕹️");

    assertLogoText(logoText);
    assertLogoTween(mainScene, logoText);
  });

  it("renders a pointer marker when the scene receives pointer input", async (): Promise<void> => {
    const mainScene = await createStartedScene();

    emitPointerDown(mainScene);
    assertPointerMarker(mainScene);
  });
});
