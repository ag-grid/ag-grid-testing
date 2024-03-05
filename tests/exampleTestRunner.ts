import { Page, expect } from "@playwright/test";
import { getRowCount, waitForCells } from "./utils";

import examples from "../config/all-examples.json";

export function getFrameworkExamples(framework: string) {
  return examples.filter((e) => e.internalFramework === framework);
}

export function getExampleConfig(e) {
  const examplePath = `${e.pageName}/${e.exampleName}/${e.importType}/${e.internalFramework}`;
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
  //"ERROR Script error. ",
  //"Failed to load resource: the server responded with a status of 404 ()", // favicon issue
];

export function setupConsoleExpectations(page) {
  const errors: string[] = [];

  // catch any errors or warnings and fail the test
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      const text = msg.text();
      if (!licenseTexts.includes(text)) {
        //expect(msg.text()).toBe(undefined);
        //expect.soft(msg.text()).toBe(undefined); //soft if you want all the errors logged and not fail the test
        errors.push(text);
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
  await getRowCount(page);
  await waitForCells(page);

  expect(errors).toEqual([]);
}