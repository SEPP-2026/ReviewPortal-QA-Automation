import { defineConfig, devices } from "@playwright/test";
import { env } from "./config/env";

export default defineConfig({
  testDir: "./tests",
  timeout: 90_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  forbidOnly: env.ci,
  retries: env.ci ? 2 : 0,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
  use: {
    baseURL: env.webBaseUrl,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 20_000,
    navigationTimeout: 60_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
