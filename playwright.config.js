import { defineConfig } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

const testDir = defineBddConfig({
  outputDir: "reports/bdd/.features",
  features: "bdd/sample.feature",
  steps: "bdd/steps.ts",
});

export default defineConfig({
  // timeout:  30_000,
  // expect: {
  //   timeout: 5_000,
  // },
  outputDir: "./reports/bdd/test-results",
  testDir,
  reporter: [["html", { outputFolder: "reports/bdd/playwright-report" }]],
  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    // Populates context with given storage state.
    storageState: "reports/bdd/state.json",
  },
});
