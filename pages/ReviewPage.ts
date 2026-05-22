import { expect, type Page } from "@playwright/test";
import { ratingLabels } from "../fixtures/test-data";
import { BasePage } from "./BasePage";

type ReviewData = {
  reviewerName: string;
  reviewerEmail: string;
  reviewText: string;
  rating: number;
};

export class ReviewPage extends BasePage {
  protected readonly path = "/equipment";

  readonly nameInput = this.page.getByLabel("Your name");
  readonly emailInput = this.page.getByLabel("Email");
  readonly feedbackInput = this.page.getByLabel("Your feedback");
  readonly submitButton = this.page.getByRole("button", {
    name: "Submit Review",
  });

  constructor(page: Page) {
    super(page);
  }

  async expectReviewFormVisible() {
    await expect(
      this.page.getByRole("heading", { name: "Write a Review" })
    ).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.feedbackInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async fillValidReview(review: ReviewData) {
    await this.nameInput.fill(review.reviewerName);
    await this.emailInput.fill(review.reviewerEmail);

    for (const label of ratingLabels) {
      await this.page
        .getByRole("button", { name: `${label} ${review.rating} stars` })
        .click();
    }

    await this.feedbackInput.fill(review.reviewText);
  }

  async submit() {
    await this.submitButton.click();
  }

  async expectSubmissionAccepted() {
    await expect(
      this.page
        .getByText(/Thanks for your review|awaiting moderation|Review submitted/i)
        .first()
    ).toBeVisible({ timeout: 15_000 });
  }
}
