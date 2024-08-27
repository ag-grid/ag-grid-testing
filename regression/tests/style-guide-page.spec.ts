import { test, expect } from "@playwright/test";

const AWAIT_TEXT = "@incldue stack-table()";

function getPages() {
  return ["/style-guide"];
}

test.describe("style guide page", () => {
  for (const pageSlug of getPages()) {
    const url = pageSlug;

    test(url, async ({ page }) => {
      test.slow();
      await page.goto(url);

      await expect(page.getByText(AWAIT_TEXT)).toBeVisible();

      await expect(page).toHaveScreenshot({
        fullPage: true,
        // A small threshold as a buffer
        maxDiffPixels: 5,
      });
    });
  }
});
