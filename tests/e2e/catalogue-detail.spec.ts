import { expect, test } from "@playwright/test";
import { env, skipMessages } from "../../config/env";
import { ToolCataloguePage } from "../../pages/ToolCataloguePage";
import { ToolDetailsPage } from "../../pages/ToolDetailsPage";

test.describe("Catalogue and tool detail workflows", () => {
  test.skip(!env.webBaseUrl, skipMessages.webBaseUrl);

  test("filters, sorts, and toggles catalogue controls", async ({ page }) => {
    const cataloguePage = new ToolCataloguePage(page);

    await cataloguePage.goto();
    await cataloguePage.expectLoaded();

    await cataloguePage.availableOnlyCheckbox.check();
    await expect(cataloguePage.availableOnlyCheckbox).toBeChecked();

    await page.selectOption("select", "name");
    await expect(page.locator("select")).toHaveValue("name");

    await cataloguePage.searchFor("drill");
    await expect(cataloguePage.searchInput).toHaveValue("drill");
    await expect(cataloguePage.resultSummary).toBeVisible();
  });

  test("uses rental calculator controls and validates booking dialog", async ({
    page,
  }) => {
    const cataloguePage = new ToolCataloguePage(page);

    await cataloguePage.goto();
    await cataloguePage.expectLoaded();

    const hasToolCards = await cataloguePage.hasVisibleToolCards();
    test.skip(
      !hasToolCards,
      "No visible equipment cards were returned by the configured API."
    );

    await cataloguePage.openFirstTool();

    const detailsPage = new ToolDetailsPage(page);
    await detailsPage.expectLoaded();

    await page.getByRole("button", { name: /Hourly/i }).click();
    await expect(page.getByText(/Estimated total/i)).toBeVisible();
    await expect(page.getByText(/\$\d+\.\d{2}/).first()).toBeVisible();

    const bookNow = page.getByRole("button", { name: /Book now/i });
    const canBook = await bookNow.isEnabled();
    test.skip(!canBook, "The selected tool is unavailable for booking.");

    await bookNow.click();

    await expect(
      page.getByRole("heading", { name: /Request a booking/i })
    ).toBeVisible();

    const bookingDialog = page.getByRole("dialog");
    await bookingDialog.getByLabel("Full name").fill("");
    await bookingDialog.getByLabel("Email").fill("invalid-email");
    await bookingDialog.getByLabel("Phone").fill("12");
    await bookingDialog
      .getByRole("button", { name: "Confirm booking request" })
      .click();

    await expect(page.getByText("Name is required")).toBeVisible();
    await expect(page.getByText("Enter a valid email")).toBeVisible();
    await expect(page.getByText("Enter a contact phone number")).toBeVisible();

    await bookingDialog.getByRole("button", { name: "Cancel" }).click();
    await expect(
      page.getByRole("heading", { name: /Request a booking/i })
    ).toBeHidden();
  });
});
