import { test, expect } from "@playwright/test";
import pages from "../../config/all-docs-pages.json";
import { FRAMEWORK_PREFIXES } from "../utils/constants";
import path from "path";

const { FILTER_PAGES, FILTER_FRAMEWORK_PREFIXES } = process.env;

/**
 * Filter the pages that get run
 *
 * Update by adding `FILTER_PAGES` to env vars
 */
const filterPages = FILTER_PAGES ? FILTER_PAGES.split(",") : [];

/**
 * Filter the framework prefixes for the pages
 *
 * Update by adding `FILTER_FRAMEWORK_PREFIXES` to env vars
 */
const filterFrameworkPrefixes = FILTER_FRAMEWORK_PREFIXES
  ? FILTER_FRAMEWORK_PREFIXES.split(",")
  : FRAMEWORK_PREFIXES;

/**
 * These pages take a while to render on the page, so
 * need to wait for some text to be visible to ensure tests
 * are more consistent.
 *
 * Choose something distinctive, that is on the bottom of
 * the page or takes a while to render.
 */
const FLAKEY_PAGES = {
  "grid-options": {
    expectTextVisible: "tooltipInteraction",
  },
  "grid-api": {
    expectTextVisible: "getCurrentRedoSize",
  },
};

const hideElementsStylePath = path.join(__dirname, "hide-elements.css");

function getPages() {
  return filterPages.length
    ? pages.docsPages.filter((page) => {
        return filterPages.includes(page);
      })
    : pages.docsPages;
}

function getFrameworkPrefixes() {
  return FRAMEWORK_PREFIXES.filter((prefix) => {
    return filterFrameworkPrefixes.includes(prefix);
  });
}

test.describe("docs pages", () => {
  for (const frameworkPrefix of getFrameworkPrefixes()) {
    for (const pageSlug of getPages()) {
      const url = `${frameworkPrefix}/${pageSlug}`;

      test(url, async ({ page }) => {
        await page.goto(url);

        const flakeyPage = FLAKEY_PAGES[pageSlug];
        if (flakeyPage) {
          await expect(
            page.getByText(flakeyPage.expectTextVisible)
          ).toBeVisible();
        }

        await expect(page).toHaveScreenshot({
          fullPage: true,
          // A small threshold as a buffer
          maxDiffPixels: 5,
        });
      });
    }
  }
});
