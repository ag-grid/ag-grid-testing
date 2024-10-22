import { Page, expect, test } from "@playwright/test";
import { getRowCountOrError, waitForGridReady } from "./utils";

import examples from "../config/all-examples.json";


export type InternalFramework =
    | 'vanilla'
    | 'typescript'
    | 'reactFunctional'
    | 'reactFunctionalTs'
    | 'angular'
    | 'vue3';

interface ExampleTestCase {
    pageName: string;
    exampleName: string;
    internalFramework: InternalFramework;
}

const testExclusions: Partial<ExampleTestCase>[] = [ 
//   {
//   pageName: "modules",
//   exampleName: "individual-registration",
// }
 ];

const matchesExclusion = (testCase: ExampleTestCase) => {
  return testExclusions.some((ex) => {
    return Object.keys(ex).every((key) => ex[key] ===  undefined ||  ex[key] === testCase[key]);
  });

}

export function getFrameworkExamples(
  framework: InternalFramework
) {
  return (examples as ExampleTestCase[]).filter(
    (e) =>
      e.internalFramework === framework &&
      !matchesExclusion(e)
  );
}

export function getSelectionOfFrameworkExamples(
  framework: InternalFramework,
  nthExample: number,
  randomOffset: number
) {
  const allExamples = getFrameworkExamples(framework);
  const filtered = allExamples.filter((_, i) => (i + randomOffset) % nthExample === 0);
  return filtered;
}

export function getExampleConfig(e, importType: undefined | 'packages' | 'modules' = undefined) {
  const examplePath = `${e.pageName}/${e.exampleName}/${importType ? importType + '/': ''}${e.internalFramework}`;
  const url = `/examples/${examplePath}/`;
  return { examplePath, url };
}

const licenseTexts = [
  "****************************************************************************************************************************",
  "************************************************ AG Grid Enterprise License ************************************************",
  "************************************************** License Key Not Found ***************************************************",
  "* All AG Grid Enterprise features are unlocked for trial.                                                                  *",
  "* If you want to hide the watermark please email info@ag-grid.com for a trial license key.                                 *",
  "***************************************** AG Grid and AG Charts Enterprise License *****************************************",
  "* All AG Grid and AG Charts Enterprise features are unlocked for trial.                                                    *",
];

// TEMPORARY: maybe need a cleaner way of ignoring these warnings for specific tests
// Errors that we want to exclude from the test based on partial text match
const excludeErrors = [
  "AG Grid: Using custom components without `reactiveCustomComponents = true` is deprecated.",
  "ERROR ResizeObserver loop completed with undelivered notifications",
  // This error is thrown when a favicon is not found which is not relevant to the test
  "Failed to load resource: the server responded with a status of 404 ()"
];

export function setupConsoleExpectations(page) {
  const errors: string[] = [];

  // catch any errors or warnings and fail the test
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      const text = msg.text();
      if (!licenseTexts.includes(text)) {
        if (excludeErrors.some((e) => text.includes(e))) {
          test.skip(false, text);
        } else {
          errors.push(text);
        }
      }
    }
  });

  return errors;
}

export async function runExampleSpec(
  page: Page,
  url: string,
  errors: string[]
) {
  await page.goto(url);

  const rowCountOrError = await getRowCountOrError(page);
  if( typeof rowCountOrError === 'string'){
    expect(rowCountOrError).toBeUndefined();
    return;
  }
  
  if(!url.includes("/overlays/") && !(url.includes("component-loading-cell-renderer/custom-loading-cell-renderer-failed"))) {
    // Overlay examples do not load data so they will never pass the standard test
    await waitForGridReady(page);
  }
  
  const root = page.locator(".ag-root-wrapper");

  let exampleRemoved = false;
  await page.evaluate(() => {
    const win: any = window;
    if(win.tearDownExample){
      win.tearDownExample();
      exampleRemoved = true;
    }
  });
  if(exampleRemoved){
    await root.waitFor({ state: "detached" });
  }

  expect(errors).toEqual([]);
}
