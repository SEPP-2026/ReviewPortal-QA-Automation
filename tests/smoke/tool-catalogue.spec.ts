import { expect, test } from "@playwright/test";
import { env, skipMessages } from "../../config/env";
import { testData } from "../../fixtures/test-data";
import { ToolCataloguePage } from "../../pages/ToolCataloguePage";
import { ToolDetailsPage } from "../../pages/ToolDetailsPage";

test.describe("Equipment catalogue smoke", () => {
  test.skip(!env.webBaseUrl, skipMessages.webBaseUrl);

  test("loads the real equipment catalogue route and search control", async ({
    page,
  }) => {
    const cataloguePage = new ToolCataloguePage(page);

    await cataloguePage.goto();
    await cataloguePage.expectLoaded();
    await cataloguePage.searchFor(testData.catalogueSearchTerm);

    await expect(cataloguePage.searchInput).toHaveValue(
      testData.catalogueSearchTerm
    );
  });

  test("opens the first catalogue item and verifies tool detail UI", async ({
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

    const toolName = await cataloguePage.firstToolName();
    test.skip(!toolName, "The first equipment card did not expose a tool name.");

    await cataloguePage.openFirstTool();

    const detailsPage = new ToolDetailsPage(page);
    await detailsPage.expectLoaded(toolName);
  });
});
