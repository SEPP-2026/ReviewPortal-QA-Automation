import { expect, test } from "@playwright/test";
import { env, skipMessages } from "../../config/env";

const publicPages = [
  {
    path: "/services",
    heading: "Our Services",
    expectedText: "Equipment Rental",
  },
  {
    path: "/pricing",
    heading: "Flexible Rental Plans",
    expectedText: "Daily",
  },
  {
    path: "/contact",
    heading: "Contact Us",
    expectedText: "Send us a Message",
  },
  {
    path: "/reviews",
    heading: "Reviews & Ratings",
    expectedText: "API Connected",
  },
  {
    path: "/login",
    heading: "Welcome back",
    expectedText: "Sign in to manage your rentals, bookings, and reviews.",
  },
  {
    path: "/register",
    heading: "Create your account",
    expectedText: "At least 8 characters with an uppercase letter and a digit.",
  },
  {
    path: "/forgot-password",
    heading: "Forgot your password?",
    expectedText: "Send reset instructions",
  },
  {
    path: "/reset-password",
    heading: "Reset password",
    expectedText: "Reset token",
  },
] as const;

test.describe("Public route coverage", () => {
  test.skip(!env.webBaseUrl, skipMessages.webBaseUrl);

  for (const pageSpec of publicPages) {
    test(`loads ${pageSpec.path}`, async ({ page }) => {
      await page.goto(pageSpec.path);

      await expect(
        page.getByRole("heading", { name: pageSpec.heading })
          .first()
      ).toBeVisible();
      await expect(page.getByText(pageSpec.expectedText).first()).toBeVisible();
    });
  }
});
