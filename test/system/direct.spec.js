// @ts-check
import { test, expect } from '@playwright/test'

test.describe('direct invocation', () => {
  test ('direct invocation with a message', async ({ page }) => {
    await page.goto('localhost:3000/confirms/div')

    const dialog = page.locator('#confirm')
    const title = page.locator('#confirm-title')

    page.evaluate(`
      const confirm = new window.TurboConfirm()
      confirm.confirm('My custom message')
    `)

    await expect(dialog).toBeVisible()
    await expect(title).toContainText('My custom message')

    await page.locator('#confirm-accept', {hasText: "Yes, I'm Sure"}).click()

    await expect(dialog).not.toBeVisible()
    await expect(title).toContainText('Are you sure?')
  })
})

// test custom config
// test confirmWithContent
