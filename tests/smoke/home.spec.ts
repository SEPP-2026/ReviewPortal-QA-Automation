import { test } from "@playwright/test";
import { env, skipMessages } from "../../config/env";
import { HomePage } from "../../pages/HomePage";

test.describe("Home page smoke", () => {
  test.skip(!env.webBaseUrl, skipMessages.webBaseUrl);

  test("loads the public home page and catalogue call to action", async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.expectLoaded();
  });
});
