// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Stimulus Controller Integration', () => {
  test('non-submit button with div based confirm', async ({ page }) => {
    await page.goto('/confirms/div')

    const header = page.getByTestId('header')
    const button = page.getByRole('button', { name: 'Click Me' })
    const dialog = page.getByTestId('confirm')
    const defaultContent = await dialog.textContent() || ''
    const customMessage = await button.getAttribute('data-confirm-message-param') || ''

    await expect(header).toContainText('Manual Confirm Test')
    await expect(dialog).toBeHidden()

    await button.click()

    await expect(dialog).toBeVisible()
    await expect(dialog).not.toContainText(defaultContent)
    await expect(dialog).toContainText(customMessage)

    await dialog.getByText("Cancel").click()

    await expect(dialog).toBeHidden()
    await expect(dialog).toContainText(defaultContent)
    await expect(header).toContainText('Confirm Rejected')

    await button.click()

    await expect(dialog).toBeVisible()
    await expect(dialog).not.toContainText(defaultContent)
    await expect(dialog).toContainText(customMessage)

    await dialog.getByText("Yes, I'm Sure").click()

    await expect(dialog).toBeHidden()
    await expect(dialog).toContainText(defaultContent)
    await expect(header).toContainText('Confirm Accepted')
  })

  test('non-submit button with dialog based confirm', async ({ page }) => {
    await page.goto('/confirms/dialog')

    const header = page.getByTestId('header')
    const button = page.getByRole('button', { name: 'Click Me' })
    const dialog = page.getByTestId('confirm')
    const defaultContent = await dialog.textContent() || ''
    const customMessage = await button.getAttribute('data-confirm-message-param') || ''

    await expect(header).toContainText('Manual Confirm Test')
    await expect(dialog).not.toHaveAttribute('open')

    await button.click()

    await expect(dialog).toHaveAttribute('open')
    await expect(dialog).not.toContainText(defaultContent)
    await expect(dialog).toContainText(customMessage)

    await dialog.getByText("Cancel").click()

    await expect(dialog).not.toHaveAttribute('open')
    await expect(dialog).toContainText(defaultContent)
    await expect(header).toContainText('Confirm Rejected')

    await button.click()

    await expect(dialog).toHaveAttribute('open')
    await expect(dialog).not.toContainText(defaultContent)
    await expect(dialog).toContainText(customMessage)

    await dialog.getByText("Yes, I'm Sure").click()

    await expect(dialog).not.toHaveAttribute('open')
    await expect(dialog).toContainText(defaultContent)
    await expect(header).toContainText('Confirm Accepted')

    await button.click()

    await expect(dialog).toHaveAttribute('open')
    await expect(dialog).not.toContainText(defaultContent)
    await expect(dialog).toContainText(customMessage)

    await page.keyboard.press('Escape')

    await expect(dialog).not.toHaveAttribute('open')
    await expect(dialog).toContainText(defaultContent)
    await expect(header).toContainText('Confirm Rejected')
  })
})
