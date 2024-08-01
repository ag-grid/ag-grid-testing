import { test, expect } from '@playwright/test';
import pages from "../config/all-docs-pages.json";

/**
 * Filter the pages that get run
 * 
 * Update by adding `FILTER_PAGES` to env vars
 */
const FILTER_PAGES = process.env.FILTER_PAGES ? process.env.FILTER_PAGES.split(',') : [];


/**
 * Filter the framework prefixes for the pages
 * 
 * Update by adding `FILTER_FRAMEWORK_PREFIXES` to env vars
 */
const FILTER_FRAMEWORK_PREFIXES = process.env.FILTER_FRAMEWORK_PREFIXES ? process.env.FILTER_FRAMEWORK_PREFIXES.split(',') : [];

/**
 * These pages take a while to render on the page, so
 * need to wait for some text to be visible to ensure tests 
 * are more consistent.
 * 
 * Choose something distinctive, that is on the bottom of
 * the page or takes a while to render.
 */
const FLAKEY_PAGES = {
  'grid-options': {
    expectTextVisible: 'tooltipInteraction'
  },
  'grid-api': {
    expectTextVisible: 'getCurrentRedoSize'
  },
  'integrated-charts-api-save-restore-charts': {
    expectTextVisible: 'restoreChart'
  },
  'global-style-customisation-sass': {
    expectTextVisible: 'measure in real world conditions'
  },
  'filter-quick': {
    expectTextVisible: 'the Quick Filter is set'
  },
  'column-state': {
    expectTextVisible: 'The order of the row group'
  },
  'excel-export-api': {
    expectTextVisible: 'Use this property to setup cell protection'
  },
  'excel-export-multiple-sheets': {
    expectTextVisible: 'except instead of downloading a file'
  }
};

const FRAMEWORK_PREFIXES = ['javascript-data-grid', 'react-data-grid', 'angular-data-grid', 'vue-data-grid'];

function getPages() {
  return FILTER_PAGES.length ? pages.docsPages.filter((page) => {
    return FILTER_PAGES.includes(page);
  }) : pages.docsPages;
}

function getFrameworkPrefixes() {
  return FILTER_FRAMEWORK_PREFIXES.length ? FRAMEWORK_PREFIXES.filter((prefix) => {
    return FILTER_FRAMEWORK_PREFIXES.includes(prefix);
  }) : FRAMEWORK_PREFIXES;
}

test.beforeAll(async () => {
  test.setTimeout(30_000);
});

test.describe('docs pages', () => {
  for (const frameworkPrefix of getFrameworkPrefixes()) {
    for (const pageSlug of getPages()) {
      const url = `${frameworkPrefix}/${pageSlug}`;

      test(url, async ({ page }) => {
        await page.goto(url);


        const flakeyPage = FLAKEY_PAGES[pageSlug];
        if (flakeyPage) {
          await expect(page.getByText(flakeyPage.expectTextVisible)).toBeVisible();
        }

        await expect(page).toHaveScreenshot({
          fullPage: true,
          // A small threshold as a buffer
          maxDiffPixels: 5
        });
      })
    }
  }
});