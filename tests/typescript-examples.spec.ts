import { test } from "@playwright/test";

import {
  getExampleConfig,
  getFrameworkExamples,
  runExampleSpec,
  setupConsoleExpectations
} from "./exampleTestRunner";

test.describe("Typescript Packages", async () => {
  for (const e of getFrameworkExamples("typescript", 'packages')) {
    const { examplePath, url } = getExampleConfig(e);

    let errors: string[];
    // catch any errors or warnings and fail the test
    test.beforeEach(async ({ page }) => {
      errors = setupConsoleExpectations(page);
    });

    test(`${examplePath}`, async ({ page }) => {
      await runExampleSpec(page, url, errors);
    });
  }
});

test.describe("Typescript Modules", async () => {
  for (const e of getFrameworkExamples("typescript", 'modules')) {
    const { examplePath, url } = getExampleConfig(e);

    let errors: string[];
    // catch any errors or warnings and fail the test
    test.beforeEach(async ({ page }) => {
      errors = setupConsoleExpectations(page);
    });

    test(`${examplePath}`, async ({ page }) => {
      await runExampleSpec(page, url, errors);
    });
  }
});
