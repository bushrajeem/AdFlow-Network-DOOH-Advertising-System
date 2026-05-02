import { test, expect } from "@playwright/test";

const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;

const hasAdminCreds = Boolean(adminEmail && adminPassword);

if (!hasAdminCreds) {
  test.skip(true, "Missing E2E_ADMIN_EMAIL or E2E_ADMIN_PASSWORD env vars");
}

test("UI-02 | Admin login redirects to dashboard", async ({ page }) => {
  await page.goto("/login");

  await page.getByPlaceholder("Email").fill(adminEmail);
  await page.getByPlaceholder("Password").fill(adminPassword);
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page).toHaveURL(/\/admin/);
  await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
});

