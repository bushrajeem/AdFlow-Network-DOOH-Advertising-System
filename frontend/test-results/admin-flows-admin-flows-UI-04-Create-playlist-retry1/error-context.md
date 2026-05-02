# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-flows.spec.js >> admin flows >> UI-04 | Create playlist
- Location: tests\e2e\admin-flows.spec.js:42:3

# Error details

```
Error: locator.click: Error: strict mode violation: getByRole('button', { name: 'Log in' }) resolved to 2 elements:
    1) <button type="submit" class="inline-flex items-center justify-center gap-2.5 w-full h-12 px-4 rounded-lg font-bold transition-all duration-200 shadow-sm !bg-[#2297FE] !text-white hover:bg-[#1a85e6] hover:shadow-md ">Log in</button> aka getByRole('button', { name: 'Log in', exact: true })
    2) <button type="button" class="inline-flex items-center justify-center gap-2.5 w-full h-12 px-4 rounded-lg font-bold transition-all duration-200 shadow-sm bg-white border-2 border-gray-100 text-gray-700 hover:bg-gray-50 hover:border-gray-200 ">…</button> aka getByRole('button', { name: 'Log in with Google' })

Call log:
  - waiting for getByRole('button', { name: 'Log in' })

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - heading "Login" [level=1] [ref=e2]
  - generic [ref=e3]:
    - generic [ref=e4]:
      - text: Email
      - generic [ref=e5]:
        - generic:
          - img
        - textbox "Email" [ref=e6]: admin@gmail.com
    - generic [ref=e8]:
      - text: Password
      - generic [ref=e9]:
        - generic:
          - img
        - textbox "Password" [active] [ref=e10]: "123456"
        - button "Show password" [ref=e11]:
          - img [ref=e12]
    - generic [ref=e15]:
      - generic [ref=e16] [cursor=pointer]:
        - checkbox "Remember me" [ref=e17]
        - text: Remember me
      - button "Forgot password?" [ref=e18]
    - button "Log in" [ref=e19]
  - generic [ref=e22]: OR
  - button "Log in with Google" [ref=e24]
  - paragraph [ref=e25]:
    - text: Need an account?
    - link "SIGN UP" [ref=e26] [cursor=pointer]:
      - /url: /signup
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | const adminEmail = process.env.E2E_ADMIN_EMAIL;
  4   | const adminPassword = process.env.E2E_ADMIN_PASSWORD;
  5   | const baseURL = (process.env.PLAYWRIGHT_BASE_URL || "").replace(/\/$/, "");
  6   | 
  7   | const hasAdminCreds = Boolean(adminEmail && adminPassword);
  8   | 
  9   | if (!hasAdminCreds) {
  10  |   test.skip(true, "Missing E2E_ADMIN_EMAIL or E2E_ADMIN_PASSWORD env vars");
  11  | }
  12  | 
  13  | async function loginAsAdmin(page) {
  14  |   await page.goto("/login");
  15  |   await page.getByPlaceholder("Email").fill(adminEmail);
  16  |   await page.getByPlaceholder("Password").fill(adminPassword);
> 17  |   await page.getByRole("button", { name: "Log in" }).click();
      |                                                      ^ Error: locator.click: Error: strict mode violation: getByRole('button', { name: 'Log in' }) resolved to 2 elements:
  18  |   await expect(page).toHaveURL(/\/admin/);
  19  | }
  20  | 
  21  | test.describe("admin flows", () => {
  22  |   test.beforeEach(async ({ page }) => {
  23  |     await loginAsAdmin(page);
  24  |   });
  25  | 
  26  |   test("UI-03 | Create ad", async ({ page }) => {
  27  |     await page.goto("/admin/ads/create");
  28  | 
  29  |     await page.getByPlaceholder("Enter ad name").fill("E2E Ad");
  30  | 
  31  |     const fileInput = page.locator('input[type="file"][accept="video/mp4"]');
  32  |     await fileInput.setInputFiles({
  33  |       name: "e2e-test.mp4",
  34  |       mimeType: "video/mp4",
  35  |       buffer: Buffer.from([0, 0, 0, 0]),
  36  |     });
  37  | 
  38  |     await page.getByRole("button", { name: "SAVE" }).click();
  39  |     await expect(page).toHaveURL(/\/admin\/ads/);
  40  |   });
  41  | 
  42  |   test("UI-04 | Create playlist", async ({ page }) => {
  43  |     await page.goto("/admin/playlists/create");
  44  | 
  45  |     await page.getByPlaceholder("e.g. Playlist - 01").fill("E2E Playlist");
  46  | 
  47  |     const noAds = page.getByText("No ads found.");
  48  |     if (await noAds.isVisible()) {
  49  |       test.skip(true, "No ads available to select");
  50  |     }
  51  | 
  52  |     const firstSelectable = page.locator("button", { hasText: "Duration:" }).first();
  53  |     if (await firstSelectable.isVisible()) {
  54  |       await firstSelectable.click();
  55  |     }
  56  | 
  57  |     const locationCards = page.locator("button", { hasText: "Assign Locations" });
  58  |     if (await locationCards.isVisible()) {
  59  |       const firstLocation = page.locator("button", { hasText: "Optional" }).first();
  60  |       if (await firstLocation.isVisible()) {
  61  |         await firstLocation.click();
  62  |       }
  63  |     }
  64  | 
  65  |     await page.getByRole("button", { name: "SAVE PLAYLIST" }).click();
  66  |     await expect(page).toHaveURL(/\/admin\/playlists/);
  67  |   });
  68  |   test("UI-06 | Ads list page loads", async ({ page }) => {
  69  |     await page.goto("/admin/ads");
  70  |     await expect(page.getByRole("heading", { name: "Ads" })).toBeVisible();
  71  |   });
  72  | 
  73  |   test("UI-07 | Playlists list page loads", async ({ page }) => {
  74  |     await page.goto("/admin/playlists");
  75  |     await expect(page.getByRole("heading", { name: "Playlists" })).toBeVisible();
  76  |   });
  77  | 
  78  |   test("UI-08 | Users list page loads", async ({ page }) => {
  79  |     await page.goto("/admin/users");
  80  |     await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
  81  |   });
  82  | 
  83  |   test("UI-09 | Screen list page loads", async ({ page }) => {
  84  |     await page.goto("/admin/screen");
  85  |     await expect(page.getByRole("heading", { name: "Screen" })).toBeVisible();
  86  |   });
  87  | 
  88  |   test("UI-10 | Location index loads", async ({ page }) => {
  89  |     await page.goto("/admin/location");
  90  |     await expect(page.getByRole("heading", { name: "Location" })).toBeVisible();
  91  |   });
  92  | });
  93  | 
  94  | test("UI-05 | Payment start", async ({ page }) => {
  95  |   await page.route("**/api/payment/initiate", async (route) => {
  96  |     const gatewayUrl = baseURL
  97  |       ? `${baseURL}/payment/fail?reason=test`
  98  |       : "https://example.com";
  99  |     await route.fulfill({
  100 |       status: 200,
  101 |       contentType: "application/json",
  102 |       body: JSON.stringify({ success: true, transactionId: "TEST", gatewayUrl }),
  103 |     });
  104 |   });
  105 | 
  106 |   await page.goto("/payment");
  107 |   await page.getByPlaceholder("0.00").fill("10");
  108 |   await page.getByPlaceholder("e.g. AdFlow").fill("E2E Brand");
  109 |   await page.getByPlaceholder("Your full name").fill("E2E User");
  110 |   await page.getByPlaceholder("you@email.com").fill("e2e@example.com");
  111 |   await page.getByPlaceholder("01XXXXXXXXX").fill("01700000000");
  112 | 
  113 |   await page.getByRole("button", { name: /Proceed to Pay/i }).click();
  114 | 
  115 |   if (baseURL) {
  116 |     await expect(page).toHaveURL(/\/payment\/fail\?reason=test/);
  117 |   }
```