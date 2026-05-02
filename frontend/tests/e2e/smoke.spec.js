import { test, expect } from "@playwright/test";

test("UI-01 | Home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
});
