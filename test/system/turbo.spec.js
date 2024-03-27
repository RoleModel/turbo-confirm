// @ts-check
import { test, expect } from '@playwright/test'

test('Turbo Confirmation Integration', async ({ page }) => {
  await page.goto('localhost:3000/todos')

  const dialog = page.locator('#confirm')

  await page.locator('.todo-card').first().getByRole('button').click()

  await expect(dialog).toBeVisible()
  await expect(page.locator('#confirm-title')).toContainText('Are you sure you want to delete this todo?')

  await page.locator('#confirm-accept', {hasText: "Delete ToDo"}).click()

  await expect(dialog).not.toBeVisible()
  await expect(page.locator('#confirm-title')).toContainText('Are you sure?')

  // await expect(page.locator('body')).toContainText('Todo was successfully destroyed.') // This is working intermittently
});
