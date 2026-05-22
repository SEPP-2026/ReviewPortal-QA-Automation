import { expect, test } from "@playwright/test";
import { env, skipMessages } from "../../config/env";

test.describe("Contact workflow", () => {
  test.skip(!env.webBaseUrl, skipMessages.webBaseUrl);

  test("submits the client-side contact form and shows acknowledgement", async ({
    page,
  }) => {
    await page.goto("/contact");

    await page.getByPlaceholder("John Smith").fill("QA Automation");
    await page.getByPlaceholder("john@example.com").fill("qa@example.com");
    await page.getByPlaceholder("+1 (234) 567-890").fill("+1 234 567 890");
    await page.locator("select").selectOption("support");
    await page
      .getByPlaceholder("Tell us about your project or question...")
      .fill("This is a safe automated contact form smoke check.");

    const dialogPromise = page.waitForEvent("dialog").then(async (dialog) => {
      expect(dialog.message()).toContain("Thank you for your message");
      await dialog.accept();
    });

    await page.getByRole("button", { name: "Send Message" }).click();
    await dialogPromise;
  });
});
