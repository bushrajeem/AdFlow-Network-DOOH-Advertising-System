import { test, expect } from "@playwright/test";

const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;
const baseURL = (process.env.PLAYWRIGHT_BASE_URL || "").replace(/\/$/, "");

const hasAdminCreds = Boolean(adminEmail && adminPassword);

if (!hasAdminCreds) {
  test.skip(true, "Missing E2E_ADMIN_EMAIL or E2E_ADMIN_PASSWORD env vars");
}

async function loginAsAdmin(page) {
  await page.goto("/login");
  await page.getByPlaceholder("Email").fill(adminEmail);
  await page.getByPlaceholder("Password").fill(adminPassword);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/admin/);
}

test.describe("admin flows", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("UI-03 | Create ad", async ({ page }) => {
    await page.goto("/admin/ads/create");

    await page.getByPlaceholder("Enter ad name").fill("E2E Ad");

    const fileInput = page.locator('input[type="file"][accept="video/mp4"]');
    await fileInput.setInputFiles({
      name: "e2e-test.mp4",
      mimeType: "video/mp4",
      buffer: Buffer.from([0, 0, 0, 0]),
    });

    await page.getByRole("button", { name: "SAVE" }).click();
    await expect(page).toHaveURL(/\/admin\/ads/);
  });

  test("UI-04 | Create playlist", async ({ page }) => {
    await page.goto("/admin/playlists/create");

    await page.getByPlaceholder("e.g. Playlist - 01").fill("E2E Playlist");

    const noAds = page.getByText("No ads found.");
    if (await noAds.isVisible()) {
      test.skip(true, "No ads available to select");
    }

    const firstSelectable = page.locator("button", { hasText: "Duration:" }).first();
    if (await firstSelectable.isVisible()) {
      await firstSelectable.click();
    }

    const locationCards = page.locator("button", { hasText: "Assign Locations" });
    if (await locationCards.isVisible()) {
      const firstLocation = page.locator("button", { hasText: "Optional" }).first();
      if (await firstLocation.isVisible()) {
        await firstLocation.click();
      }
    }

    await page.getByRole("button", { name: "SAVE PLAYLIST" }).click();
    await expect(page).toHaveURL(/\/admin\/playlists/);
  });
  test("UI-06 | Ads list page loads", async ({ page }) => {
    await page.goto("/admin/ads");
    await expect(page.getByRole("heading", { name: "Ads" })).toBeVisible();
  });

  test("UI-07 | Playlists list page loads", async ({ page }) => {
    await page.goto("/admin/playlists");
    await expect(page.getByRole("heading", { name: "Playlists" })).toBeVisible();
  });

  test("UI-08 | Users list page loads", async ({ page }) => {
    await page.goto("/admin/users");
    await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
  });

  test("UI-09 | Screen list page loads", async ({ page }) => {
    await page.goto("/admin/screen");
    await expect(page.getByRole("heading", { name: "Screen" })).toBeVisible();
  });

  test("UI-10 | Location index loads", async ({ page }) => {
    await page.goto("/admin/location");
    await expect(page.getByRole("heading", { name: "Location" })).toBeVisible();
  });
});

test("UI-05 | Payment start", async ({ page }) => {
  await page.route("**/api/payment/initiate", async (route) => {
    const gatewayUrl = baseURL
      ? `${baseURL}/payment/fail?reason=test`
      : "https://example.com";
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, transactionId: "TEST", gatewayUrl }),
    });
  });

  await page.goto("/payment");
  await page.getByPlaceholder("0.00").fill("10");
  await page.getByPlaceholder("e.g. AdFlow").fill("E2E Brand");
  await page.getByPlaceholder("Your full name").fill("E2E User");
  await page.getByPlaceholder("you@email.com").fill("e2e@example.com");
  await page.getByPlaceholder("01XXXXXXXXX").fill("01700000000");

  await page.getByRole("button", { name: /Proceed to Pay/i }).click();

  if (baseURL) {
    await expect(page).toHaveURL(/\/payment\/fail\?reason=test/);
  }
});
