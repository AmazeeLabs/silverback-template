import { expect, test } from '@playwright/test';
import { cmsUrl } from '../helpers/url';

test.describe('instant preview', () => {
  test.use({ storageState: '.auth/admin.json' });
  test('display an unpublished page in an iframe', async ({ page }) => {
    await page.goto(cmsUrl('/admin/content'));
    await page.getByRole('link', { name: 'Add content' }).click();
    await page
      .getByLabel('Title', { exact: true })
      .fill('Instant preview test');
    await page
      .getByText('Add text or type / to add content')
      .fill('This is visible instantly.');
    await page.locator('#edit-submit').click();
    await expect(
      page.getByRole('heading', { name: 'Instant preview test', exact: true }),
    ).toBeVisible();
    await expect(
      page.frameLocator('iframe').getByText('This is visible instantly.'),
    ).toBeVisible();

    await page.getByRole('link', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(
      page.getByText('The Basic page Instant preview test has been deleted.', {
        exact: true,
      }),
    ).toBeVisible();
  });
});
