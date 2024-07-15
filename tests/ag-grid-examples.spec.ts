import { test } from "@playwright/test";

import {
  getExampleConfig,
  getFrameworkExamples,
  getSelectionOfFrameworkExamples,
  ImportType,
  InternalFramework,
  runExampleSpec,
  setupConsoleExpectations
} from "./exampleTestRunner";

const frameworks: InternalFramework[] = [
  "vanilla",
  "typescript",
  "reactFunctional",
  "reactFunctionalTs",
  "angular",
  "vue3",
];
const importTypes: ImportType[] = ["modules", "packages"];

const allExamplesCount = getFrameworkExamples(
  'typescript',
  'modules'
).length;
const fractionToRun = process.env.AG_GRID_PERCENTAGE_TO_RUN ? Number(process.env.AG_GRID_PERCENTAGE_TO_RUN) : 0.01;
// Get every nth example based on the percentage of tests to run
const nthExample = Math.round(
  allExamplesCount / (fractionToRun * allExamplesCount)
);
const randomOffset = new Date().getDate() % nthExample;
console.log(`Running ${fractionToRun * 100}% of examples. Running every ${nthExample}th example with a random offset of ${randomOffset} of a total of ${allExamplesCount} examples`);

test.use({
  baseURL: 'https://ag-grid.com',
});

for (const importType of importTypes) {
  test.describe(`AG Grid ${importType}`, async () => {
    for (const framework of frameworks) {
      test.describe(`${framework} ${importType} `, async () => {

        for (const e of getSelectionOfFrameworkExamples(
          framework,
          importType,
          nthExample,
          randomOffset
        )) {
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
    }
  });
}
