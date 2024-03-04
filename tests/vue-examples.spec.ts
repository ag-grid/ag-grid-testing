import { test } from "@playwright/test";

import {
  getExampleConfig,
  getFrameworkExamples,
  runExampleSpec,
  setupConsoleExpectations
} from "./exampleTestRunner";

test.describe("Vue Examples", async () => {
  for (const e of getFrameworkExamples("vue")) {
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
