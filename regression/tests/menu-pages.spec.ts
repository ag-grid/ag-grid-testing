import { test, expect } from "@playwright/test";
import pages from "../../config/all-docs-pages.json";

const extraPages = [
  "/community/events",
  "/community/showcase",
  "/community/tools-extensions",
  "/community/media",

  "/changelog",

  "/pipeline",
];

function getPages() {
  return pages.menuPages.header
    .filter((page) => page.startsWith("/"))
    .concat(extraPages);
}

test.describe("menu header pages", () => {
  for (const pageSlug of getPages()) {
    const url = pageSlug;

    test(url, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveScreenshot({
        fullPage: true,
        // A small threshold as a buffer
        maxDiffPixels: 5,
      });
    });
  }
});
