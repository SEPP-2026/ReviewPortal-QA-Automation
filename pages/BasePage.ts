import { type Locator, type Page } from "@playwright/test";

export abstract class BasePage {
  protected abstract readonly path: string;

  constructor(protected readonly page: Page) {}

  async goto(pathSuffix = "") {
    await this.page.goto(`${this.path}${pathSuffix}`);
  }

  protected async isVisible(locator: Locator, timeout = 10_000) {
    try {
      await locator.waitFor({ state: "visible", timeout });
      return true;
    } catch {
      return false;
    }
  }
}
