import { expect, test } from "@playwright/test";
import { env, skipMessages } from "../../config/env";
import { AdminLoginPage } from "../../pages/AdminLoginPage";

const adminPages = [
  {
    path: "/admin",
    heading: "Admin Dashboard",
    expectedText: "Quick actions",
  },
  {
    path: "/admin/moderation",
    heading: "Moderation Queue",
    expectedText: /Pending items|No pending reviews/i,
  },
  {
    path: "/admin/bookings",
    heading: "Bookings",
    expectedText: /Pending|No bookings yet/i,
  },
  {
    path: "/admin/tools",
    heading: "Tool Catalogue",
    expectedText: /Create new tool|Search tools|Manage images/i,
  },
  {
    path: "/admin/categories",
    heading: "Categories",
    expectedText: /Create category|Category name|Organise/i,
  },
] as const;

test.describe("Admin console read-only coverage", () => {
  test.skip(!env.webBaseUrl, skipMessages.webBaseUrl);
  test.skip(!env.adminEmail || !env.adminPassword, skipMessages.adminCredentials);

  test.beforeEach(async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.gotoAdminLogin("/admin");
    await loginPage.login(env.adminEmail!, env.adminPassword!);
    await expect(page.getByText("Staff console")).toBeVisible();
  });

  for (const pageSpec of adminPages) {
    test(`loads ${pageSpec.path}`, async ({ page }) => {
      await page.goto(pageSpec.path);

      await expect(
        page.getByRole("heading", { name: pageSpec.heading })
      ).toBeVisible();
      await expect(page.getByText(pageSpec.expectedText).first()).toBeVisible();
    });
  }
});
