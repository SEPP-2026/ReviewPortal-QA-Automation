import { expect, test } from "@playwright/test";
import { env, skipMessages } from "../../config/env";
import { AdminLoginPage } from "../../pages/AdminLoginPage";

test.describe("Authentication and account validation", () => {
  test.skip(!env.webBaseUrl, skipMessages.webBaseUrl);

  test("shows validation on login form without calling protected pages", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("Enter a valid email")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();
  });

  test("shows validation on registration form for invalid details", async ({
    page,
  }) => {
    await page.goto("/register");
    await page.getByLabel("Full name").fill("");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Password").fill("weak");
    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page.getByText("Name is required")).toBeVisible();
    await expect(page.getByText("Enter a valid email")).toBeVisible();
    await expect(page.getByText("At least 8 characters")).toBeVisible();
  });

  test("shows validation on password reset form", async ({ page }) => {
    await page.goto("/reset-password");
    await page.getByLabel("Email").fill("customer@example.com");
    await page.getByLabel("Reset token").fill("token");
    await page.getByLabel("New password", { exact: true }).fill("Newpass1");
    await page.getByLabel("Confirm new password").fill("Different1");
    await page.getByRole("button", { name: "Reset password" }).click();

    await expect(page.getByText("Passwords do not match")).toBeVisible();
  });

  test("shows validation on change password form after sign in", async ({
    page,
  }) => {
    test.skip(
      !env.adminEmail || !env.adminPassword,
      skipMessages.adminCredentials
    );

    const loginPage = new AdminLoginPage(page);
    await loginPage.gotoAdminLogin("/account/change-password");
    await loginPage.login(env.adminEmail!, env.adminPassword!);

    await expect(
      page.getByRole("heading", { name: "Change password" })
    ).toBeVisible();

    await page.getByRole("button", { name: "Change password" }).click();

    await expect(page.getByText("Current password is required")).toBeVisible();
    await expect(page.getByText("At least 8 characters", { exact: true })).toBeVisible();
  });
});
