import { expect, test } from "@playwright/test";
import { env, skipMessages } from "../../config/env";
import { AdminLoginPage } from "../../pages/AdminLoginPage";

test.describe("Admin authentication", () => {
  test.skip(!env.webBaseUrl, skipMessages.webBaseUrl);

  test("signs into the guarded admin console when credentials are configured", async ({
    page,
  }) => {
    test.skip(
      !env.adminEmail || !env.adminPassword,
      skipMessages.adminCredentials
    );

    const loginPage = new AdminLoginPage(page);
    await loginPage.gotoAdminLogin("/admin");
    await loginPage.expectLoaded();
    await loginPage.login(env.adminEmail!, env.adminPassword!);

    await expect(page).toHaveURL(/\/admin(\/moderation)?/);
    await expect(page.getByText("Staff console")).toBeVisible();
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
  });
});
