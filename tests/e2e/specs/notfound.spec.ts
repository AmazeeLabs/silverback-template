import { test, expect } from '@playwright/test';
import { websiteUrl } from '../helpers/url';

test.describe('not found pages', () => {
  test('are english by default', async ({ page }) => {
    await page.goto(websiteUrl('/i-dont-exist'));
    const content = await page.getByRole('main');
    await expect(content.getByText('This page was not found.')).toBeVisible();
  });
  test('are german if the prefix is there', async ({ page }) => {
    await page.goto(websiteUrl('/de/i-dont-exist'));
    const content = await page.getByRole('main');
    await expect(
      content.getByText('Diese Seite wurde nicht gefunden.'),
    ).toBeVisible();
  });
});
