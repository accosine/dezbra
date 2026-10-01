import { expect, type Locator, type Page, test } from "@playwright/test";

const EXPECTED_GAME_CANVAS_COUNT = 1;
const DESIGN_WIDTH = 430;
const BUTTON_X = 215;
const BUTTON_Y = { continue: 790, menuPlay: 470 };
const NO_ERRORS = 0;
const TITLE = "DEAD PIXELS";
const FONT_PROBE = '16px "Press Start 2P"';

const collectPageErrors = (page: Page): ReadonlyArray<Error> => {
  const errors: Array<Error> = [];

  page.on("pageerror", (error) => {
    errors.push(error);
  });

  return errors;
};

const tapDesignPoint = async (canvas: Locator, y: number): Promise<void> => {
  const box = await canvas.boundingBox();
  const scale = (box?.width ?? DESIGN_WIDTH) / DESIGN_WIDTH;

  await canvas.click({ position: { x: BUTTON_X * scale, y: y * scale } });
};

test("renders the game canvas", async ({ page }): Promise<void> => {
  await page.goto("/");

  const gameCanvas = page.locator("#game canvas");

  await expect(page).toHaveTitle(TITLE);
  await expect(gameCanvas).toHaveCount(EXPECTED_GAME_CANVAS_COUNT);
  await expect(gameCanvas).toBeVisible();
});

test("starts a run from the menu without page errors", async ({
  page,
}): Promise<void> => {
  const errors = collectPageErrors(page);
  const gameCanvas = page.locator("#game canvas");

  await page.goto("/");
  await page.waitForFunction(
    (font: string): boolean => document.fonts.check(font),
    FONT_PROBE,
  );
  await tapDesignPoint(gameCanvas, BUTTON_Y.menuPlay);
  await tapDesignPoint(gameCanvas, BUTTON_Y.continue);
  await tapDesignPoint(gameCanvas, BUTTON_Y.continue);

  expect(errors).toHaveLength(NO_ERRORS);
  await expect(gameCanvas).toBeVisible();
});
