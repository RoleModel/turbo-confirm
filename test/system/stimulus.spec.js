// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Stimulus Controller Integration', () => {
  test('non-form button with div based confirm', async ({ page }) => {
    await page.goto('localhost:3000/confirms/div');

    const header = page.getByTestId('header');
    const button = page.getByText('Custom Message');
    const dialog = page.getByTestId('confirm');
    const customMessage = await button.getAttribute('data-confirm-message-param') || '';

    await expect(header).toContainText('Manual Confirm Test');
    await expect(dialog).not.toBeVisible();

    await button.click();

    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(customMessage);

    await dialog.getByText("Yes, I'm Sure").click();

    await expect(dialog).not.toBeVisible();
    await expect(header).toContainText('A confirm has been accepted');
  })

  test('non-form button with dialog based confirm', async ({ page }) => {
    await page.goto('localhost:3000/confirms/dialog');

    const header = page.getByTestId('header');
    const button = page.getByText('Custom Message');
    const dialog = page.getByTestId('confirm');
    const customMessage = await button.getAttribute('data-confirm-message-param') || '';

    await expect(header).toContainText('Manual Confirm Test');
    await expect(dialog).not.toHaveAttribute('open');

    await button.click();

    await expect(dialog).toHaveAttribute('open');
    await expect(dialog).toContainText(customMessage);

    await dialog.getByText("Yes, I'm Sure").click();

    await expect(dialog).not.toHaveAttribute('open');
    await expect(header).toContainText('A confirm has been accepted');
  })

  // TODO: dialog element escape key press to cancel
  // custom config
})
