# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-login.spec.js >> UI-02 | Admin login redirects to dashboard
- Location: tests\e2e\admin-login.spec.js:12:1

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
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | const adminEmail = process.env.E2E_ADMIN_EMAIL;
  4  | const adminPassword = process.env.E2E_ADMIN_PASSWORD;
  5  | 
  6  | const hasAdminCreds = Boolean(adminEmail && adminPassword);
  7  | 
  8  | if (!hasAdminCreds) {
  9  |   test.skip(true, "Missing E2E_ADMIN_EMAIL or E2E_ADMIN_PASSWORD env vars");
  10 | }
  11 | 
  12 | test("UI-02 | Admin login redirects to dashboard", async ({ page }) => {
  13 |   await page.goto("/login");
  14 | 
  15 |   await page.getByPlaceholder("Email").fill(adminEmail);
  16 |   await page.getByPlaceholder("Password").fill(adminPassword);
> 17 |   await page.getByRole("button", { name: "Log in" }).click();
     |                                                      ^ Error: locator.click: Error: strict mode violation: getByRole('button', { name: 'Log in' }) resolved to 2 elements:
  18 | 
  19 |   await expect(page).toHaveURL(/\/admin/);
  20 |   await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
  21 | });
  22 | 
  23 | 
```