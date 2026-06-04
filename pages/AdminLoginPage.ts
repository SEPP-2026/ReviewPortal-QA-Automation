import { expect, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AdminLoginPage extends BasePage {
  protected readonly path = "/login";

  readonly heading = this.page.getByRole("heading", {
    name: /Welcome back|Sign in/i,
  });
  readonly emailInput = this.page.getByLabel("Email");
  readonly passwordInput = this.page.getByLabel("Password");
  readonly signInButton = this.page.getByRole("button", { name: "Sign in" });

  constructor(page: Page) {
    super(page);
  }

  async gotoAdminLogin(nextPath = "/admin") {
    await this.page.goto(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
