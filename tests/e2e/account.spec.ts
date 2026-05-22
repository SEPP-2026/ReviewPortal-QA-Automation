import { expect, test } from "@playwright/test";
import { env, skipMessages } from "../../config/env";
import { AdminLoginPage } from "../../pages/AdminLoginPage";

test.describe("Authenticated account pages", () => {
  test.skip(!env.webBaseUrl, skipMessages.webBaseUrl);
  test.skip(!env.adminEmail || !env.adminPassword, skipMessages.adminCredentials);

  test.beforeEach(async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.gotoAdminLogin("/");
    await loginPage.login(env.adminEmail!, env.adminPassword!);
    await expect(page.getByText(/Hi,|Staff/).first()).toBeVisible();
  });

  test("loads My reviews page", async ({ page }) => {
    await page.goto("/account/reviews");

    await expect(page.getByRole("heading", { name: "My reviews" })).toBeVisible();
    await expect(page.getByText("Signed in as")).toBeVisible();
  });

  test("loads Account change password page without changing credentials", async ({
    page,
  }) => {
    await page.goto("/account/change-password");

    await expect(
      page.getByRole("heading", { name: "Change password" })
    ).toBeVisible();
    await expect(page.getByLabel("Current password")).toBeVisible();
    await expect(page.getByLabel("New password", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Confirm new password")).toBeVisible();
  });
});
