import { expect, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ToolDetailsPage extends BasePage {
  protected readonly path = "/equipment";

  readonly backToEquipmentLink = this.page.getByRole("link", {
    name: /Back to Equipment/i,
  });

  readonly rentalCalculatorHeading = this.page.getByRole("heading", {
    name: "Rental Calculator",
  });

  readonly customerReviewsHeading = this.page.getByRole("heading", {
    name: "Customer Reviews",
  });

  readonly writeReviewHeading = this.page.getByRole("heading", {
    name: "Write a Review",
  });

  readonly submitReviewButton = this.page.getByRole("button", {
    name: "Submit Review",
  });

  constructor(page: Page) {
    super(page);
  }

  async gotoTool(toolId: number | string) {
    await this.page.goto(`/equipment/${toolId}`);
  }

  async expectLoaded(expectedToolName?: string) {
    if (expectedToolName) {
      await expect(
        this.page.getByRole("heading", {
          name: expectedToolName,
          level: 1,
        })
      ).toBeVisible();
    }

    await expect(this.backToEquipmentLink.first()).toBeVisible();
    await expect(this.rentalCalculatorHeading).toBeVisible();
    await expect(this.customerReviewsHeading).toBeVisible();
    await expect(this.writeReviewHeading).toBeVisible();
    await expect(this.submitReviewButton).toBeVisible();
  }
}
