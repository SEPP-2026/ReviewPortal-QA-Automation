import { test } from "@playwright/test";
import { env, skipMessages } from "../../config/env";
import { testData } from "../../fixtures/test-data";
import { ReviewPage } from "../../pages/ReviewPage";
import { ToolCataloguePage } from "../../pages/ToolCataloguePage";
import { ToolDetailsPage } from "../../pages/ToolDetailsPage";

test.describe("Review submission", () => {
  test.skip(!env.webBaseUrl, skipMessages.webBaseUrl);
  test.skip(!env.runReviewSubmission, skipMessages.reviewSubmission);

  test("submits a customer review to the moderation workflow when explicitly enabled", async ({
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

    const reviewPage = new ReviewPage(page);
    await reviewPage.expectReviewFormVisible();
    await reviewPage.fillValidReview(testData.validReview());
    await reviewPage.submit();
    await reviewPage.expectSubmissionAccepted();
  });
});
