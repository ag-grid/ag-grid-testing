import { test } from "@playwright/test";
import {
  runExampleSpec,
  setupConsoleExpectations,
  setupExponentialBackoff,
} from "./exampleTestRunner";

const demoUrls = [
  "example",
  "example-finance",
  "example-hr",
  "example-inventory",
];

test.describe(`Demo Examples`, async () => {
  for (const e of demoUrls) {
    let errors: string[];
    // catch any errors or warnings and fail the test
    test.beforeEach(async ({ page }) => {
      errors = setupConsoleExpectations(page);
    });

    setupExponentialBackoff();

    test(`${e}`, async ({ page }) => {
      await runExampleSpec(page, e, errors, false);
    });
  }
});
