import { expect, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ToolCataloguePage extends BasePage {
  protected readonly path = "/equipment";

  readonly heading = this.page.getByRole("heading", {
    name: "Equipment Catalogue",
  });

  readonly searchToggle = this.page.getByRole("button", {
    name: "Toggle search",
  });

  readonly searchInput = this.page.getByPlaceholder("Search equipment...");
  readonly availableOnlyCheckbox = this.page.getByLabel("Available only");
  readonly sortSelect = this.page.locator("select").filter({
    has: this.page.locator('option[value="name"]'),
  });
  readonly resultSummary = this.page.getByText(/Showing\s+\d+\s+results/i);
  readonly firstToolCard = this.page
    .getByRole("link")
    .filter({ hasText: /View Details/i })
    .first();
  readonly emptyState = this.page.getByText("No equipment found");

  constructor(page: Page) {
    super(page);
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible({ timeout: 30_000 });
    await expect(this.searchToggle).toBeVisible();
    await expect(this.availableOnlyCheckbox).toBeVisible();
    await expect(this.resultSummary).toBeVisible({ timeout: 30_000 });
  }

  async expandSearch() {
    await this.searchToggle.click();
    await expect(this.searchInput).toBeVisible();
  }

  async searchFor(query: string) {
    await this.expandSearch();
    await this.searchInput.fill(query);
  }

  async hasVisibleToolCards(timeout = 15_000) {
    return this.isVisible(this.firstToolCard, timeout);
  }

  async firstToolName() {
    const heading = this.firstToolCard.getByRole("heading").first();
    return (await heading.textContent())?.trim();
  }

  async openFirstTool() {
    await this.firstToolCard.click();
  }
}
