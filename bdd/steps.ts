import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

Given('I navigate to {string}', async ({ page }, pathname) => {
  await page.goto("about:blank");
  await page.goto(pathname);
});

When('I click link {string}', async ({ page }, name) => {
  await page.getByRole('link', { name }).click();
});

Then('I see in title {string}', async ({ page }, keyword) => {
  await expect(page).toHaveTitle(new RegExp(keyword));
});

Then('there is an element {string} with value {string}', async ({ page }, locator, value) => {
  await expect(page.locator(locator, { hasText: value })).toBeVisible();
});

Then('there is a link to {string}', async ({ page }, href) => {
  await expect(page.locator(`a[href='${href}']`)).toBeVisible();
});

Then('there is a {string} with value {string}', async ({ page }, role, value) => {
  await expect(page.getByRole(role).filter({ hasText: value })).toBeVisible();
});
