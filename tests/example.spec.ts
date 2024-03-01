import { test, expect } from "@playwright/test";

import examples from "../config/all-examples.json";
import { getRowCount, waitForCells } from "./utils";

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


test.describe("Examples", async () => {
  
  for (const e of examples.filter(e => e.internalFramework === "typescript")) {
    const examplePath = `${e.pageName}/${e.exampleName}/${e.importType}/${e.internalFramework}`;
    const url = `/examples/${examplePath}/`;
    
    const errors = [];

    // catch any errors or warnings and fail the test
    test.beforeEach(async ({ page }) => {
      page.on("console", (msg) => {
        if (msg.type() === "error" || msg.type() === "warning") {
          const text = msg.text();
          if(!licenseTexts.includes(text)){
            //expect(msg.text()).toBe(undefined);
            //expect.soft(msg.text()).toBe(undefined); //soft if you want all the errors logged and not fail the test
            errors.push(text);
          }
        }
      });
    });

    test(`${examplePath}`, async ({ page }) => {
      await page.goto(url);
      // Wait for the grid to finish rendering and for the cells to be visible
      //await waitForCells(page);
      await getRowCount(page);

      expect(errors).toEqual([]);

      //await page.waitForTimeout(5000);
    });
  }
});
