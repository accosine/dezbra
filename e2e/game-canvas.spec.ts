import { expect, test } from "@playwright/test";

const EXPECTED_GAME_CANVAS_COUNT = 1;

test("renders the game canvas", async ({ page }): Promise<void> => {
  await page.goto("/");

  const gameCanvas = page.locator("#game canvas");

  await expect(gameCanvas).toHaveCount(EXPECTED_GAME_CANVAS_COUNT);
  await expect(gameCanvas).toBeVisible();
});
