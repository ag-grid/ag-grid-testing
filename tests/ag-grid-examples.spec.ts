import { test } from "@playwright/test";

import {
  getExampleConfig,
  getFrameworkExamples,
  getSelectionOfFrameworkExamples,
  InternalFramework,
  runExampleSpec,
  setupConsoleExpectations,
} from "./exampleTestRunner";

const frameworks: InternalFramework[] = [
  "vanilla",
  "typescript",
  "reactFunctional",
  "reactFunctionalTs",
  "angular",
  "vue3",
];
const allExamplesCount = getFrameworkExamples("typescript").length;
const fractionToRun = process.env.AG_GRID_PERCENTAGE_TO_RUN
  ? Number(process.env.AG_GRID_PERCENTAGE_TO_RUN)
  : 0.01;
// Get every nth example based on the percentage of tests to run
const nthExample = Math.round(
  allExamplesCount / (fractionToRun * allExamplesCount)
);
const randomOffset = new Date().getDate() % nthExample;
console.log(
  `Running ${
    fractionToRun * 100
  }% of examples. Running every ${nthExample}th example with a random offset of ${randomOffset} of a total of ${allExamplesCount} examples`
);

test.use({
  baseURL: "https://ag-grid.com",
});

test.describe(`AG Grid`, async () => {
  for (const framework of frameworks) {
    // Needed until v33 is released to production
    for (const importType of framework === "vanilla"
      ? (["packages"] as const)
      : (["packages", "modules"] as const)) {
      test.describe(`${framework} ${importType}`, async () => {
        for (const e of getSelectionOfFrameworkExamples(
          framework,
          nthExample,
          randomOffset
        )) {
          const { examplePath, url } = getExampleConfig(e, importType);

          if(examplePath.includes("modules/individual-registration/packages/")) {
            // This example is not present on production
            continue;
          }

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
    }
  }
});
