import { expect, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  protected readonly path = "/";

  readonly heroHeading = this.page.getByRole("heading", {
    name: /Rent Quality Tools/i,
  });

  readonly browseEquipmentLink = this.page.getByRole("link", {
    name: /Browse( Available)? Equipment|All categories|View All Equipment/i,
  }).first();

  readonly rentEquipmentLink = this.page.getByRole("link", {
    name: /Rent Equipment/i,
  });

  constructor(page: Page) {
    super(page);
  }

  async expectLoaded() {
    await expect(this.heroHeading).toBeVisible();
    await expect(this.browseEquipmentLink).toBeVisible();
    await expect(this.rentEquipmentLink).toBeVisible();
  }
}
