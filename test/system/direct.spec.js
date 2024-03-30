// @ts-check
import { test, expect } from '@playwright/test'

test.describe('direct invocation', () => {
  test ('direct invocation with a message', async ({ page }) => {
    await page.goto('localhost:3000/confirms/div')

    const header = page.getByTestId('header');
    const dialog = page.getByTestId('confirm')
    const dialogTitle = page.locator('#confirm-title')
    const defaultContent = await dialog.textContent() || ''

    page.evaluate(`
      const tc = new TurboConfirm()
      tc.confirm('My custom message').then(response => {
        if (response) {
          document.querySelector('[data-testid="header"]').innerHTML = 'Direct Confirm Accepted'
        } else {
          document.querySelector('[data-testid="header"]').innerHTML = 'Direct Confirm Rejected'
        }
      })
    `)

    await expect(dialog).toBeVisible()
    await expect(dialog).not.toContainText(defaultContent)
    await expect(dialogTitle).toContainText('My custom message')

    await dialog.getByText("Cancel").click()

    await expect(dialog).not.toBeVisible()
    await expect(dialog).toContainText(defaultContent)
    await expect(header).toContainText('Direct Confirm Rejected')

    page.evaluate(`
      const tc = new TurboConfirm()
      tc.confirm('A different message').then(response => {
        if (response) {
          document.querySelector('[data-testid="header"]').innerHTML = 'Direct Confirm Accepted'
        } else {
          document.querySelector('[data-testid="header"]').innerHTML = 'Direct Confirm Rejected'
        }
      })
    `)

    await expect(dialog).toBeVisible()
    await expect(dialog).not.toContainText(defaultContent)
    await expect(dialogTitle).toContainText('A different message')

    await dialog.getByText("Yes, I'm Sure").click()

    await expect(dialog).not.toBeVisible()
    await expect(dialog).toContainText(defaultContent)
    await expect(header).toContainText('Direct Confirm Accepted')
  })
})

// test custom config
// test confirmWithContent
