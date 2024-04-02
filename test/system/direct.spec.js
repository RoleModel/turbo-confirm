// @ts-check
import { test, expect } from '@playwright/test'

test.describe('direct invocation', () => {
  test ('with a message', async ({ page }) => {
    await page.goto('/confirms/div')

    const header = page.getByTestId('header')
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

    await dialog.getByText('Cancel').click()

    await expect(dialog).toBeHidden()
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

    await expect(dialog).toBeHidden()
    await expect(dialog).toContainText(defaultContent)
    await expect(header).toContainText('Direct Confirm Accepted')
  })

  test ('without a message', async ({ page }) => {
    await page.goto('/confirms/dialog')

    const header = page.getByTestId('header')
    const dialog = page.getByTestId('confirm')
    const defaultContent = await dialog.textContent() || ''

    page.evaluate(`
      const tc = new TurboConfirm()
      tc.confirm().then(response => {
        if (response) {
          document.querySelector('[data-testid="header"]').innerHTML = 'Accepted No Message'
        } else {
          document.querySelector('[data-testid="header"]').innerHTML = 'Rejected No Message'
        }
      })
    `)

    await expect(dialog).toHaveAttribute('open')
    await expect(dialog).toContainText(defaultContent)

    await dialog.getByText('Cancel').click()

    await expect(dialog).not.toHaveAttribute('open')
    await expect(dialog).toContainText(defaultContent)
    await expect(header).toContainText('Rejected No Message')

    page.evaluate(`
      const tc = new TurboConfirm()
      tc.confirm().then(response => {
        if (response) {
          document.querySelector('[data-testid="header"]').innerHTML = 'Accepted No Message'
        } else {
          document.querySelector('[data-testid="header"]').innerHTML = 'Rejected No Message'
        }
      })
    `)

    await expect(dialog).toHaveAttribute('open')
    await expect(dialog).toContainText(defaultContent)

    await dialog.getByText("Yes, I'm Sure").click()

    await expect(dialog).not.toHaveAttribute('open')
    await expect(dialog).toContainText(defaultContent)
    await expect(header).toContainText('Accepted No Message')
  })

  test ('with content', async ({ page }) => {
    await page.goto('/confirms/div')

    const header = page.getByTestId('header')
    const dialog = page.getByTestId('confirm')
    const defaultContent = await dialog.textContent() || ''

    page.evaluate(`
      const tc = new TurboConfirm()
      const contentMap = {
        '#confirm-title': 'A Custom Title',
        '#confirm-body': 'A Custom Description',
        '#confirm-cancel': 'Nope',
        '#confirm-accept': 'Yep'
      }

      tc.confirmWithContent(contentMap).then(response => {
        if (response) {
          document.querySelector('[data-testid="header"]').innerHTML = 'Confirm With Content'
        } else {
          document.querySelector('[data-testid="header"]').innerHTML = 'Reject With Content'
        }
      })
    `)

    await expect(dialog).toBeVisible()
    await expect(dialog.locator('#confirm-title')).toContainText('A Custom Title')
    await expect(dialog.locator('#confirm-body')).toContainText('A Custom Description')
    await expect(dialog.locator('#confirm-accept')).toContainText('Yep')

    await dialog.getByText('Nope').click()

    await expect(dialog).toBeHidden()
    await expect(dialog).toContainText(defaultContent)
    await expect(header).toContainText('Reject With Content')

    page.evaluate(`
      const tc = new TurboConfirm()
      const contentMap = {
        '#confirm-body': '<p>This is <strong>Permanent</strong>!</p>',
        '#confirm-accept': 'Yolo!'
      }

      tc.confirmWithContent(contentMap).then(response => {
        if (response) {
          document.querySelector('[data-testid="header"]').innerHTML = 'Confirm With Content'
        } else {
          document.querySelector('[data-testid="header"]').innerHTML = 'Reject With Content'
        }
      })
    `)

    await expect(dialog).toBeVisible()
    await expect(dialog.locator('#confirm-title')).toContainText('Are you sure?')
    await expect(dialog.locator('#confirm-body')).toContainText('This is Permanent!')
    await expect(dialog.locator('#confirm-cancel')).toContainText('Cancel')

    await dialog.getByText('Yolo!').click()

    await expect(dialog).toBeHidden()
    await expect(dialog).toContainText(defaultContent)
    await expect(header).toContainText('Confirm With Content')
  })

  test.describe('using custom config', () => {
    test ('with or without a message', async ({ page }) => {
      await page.goto('/confirms/custom')

      const header = page.getByTestId('header')
      const dialog = page.getByTestId('confirm')
      const defaultContent = await dialog.textContent() || ''

      page.evaluate(`
        const tc = new TurboConfirm({
          dialogSelector: '#custom-confirm',
          activeClass: 'is-open',
          acceptSelector: '#confirm-yes',
          denySelector: '#confirm-no',
          messageSlotSelector: '#modal-body',
          showConfirmCallback: () => document.querySelector('[data-testid="header"]').innerHTML = 'Confirm Shown',
          hideConfirmCallback: null
        })

        tc.confirm('<strong>Replacement Content</strong>').then(response => {
          if (response) {
            document.querySelector('[data-testid="header"]').innerHTML = 'Custom Confirm Accepted'
          } else {
            document.querySelector('[data-testid="header"]').innerHTML = 'Custom Confirm Rejected'
          }
        })
      `)

      await expect(dialog).toBeVisible()
      await expect(dialog).not.toContainText(defaultContent)
      await expect(dialog.locator('#modal-body')).toContainText('Replacement Content')

      await expect(header).toContainText('Confirm Shown')

      await dialog.getByText('Cancel').click()

      await expect(dialog).toBeHidden()
      await expect(dialog).toContainText(defaultContent)

      await expect(header).toContainText('Custom Confirm Rejected')

      page.evaluate(`
        const tc = new TurboConfirm({
          dialogSelector: '#custom-confirm',
          activeClass: 'is-open',
          acceptSelector: '#description',
          denySelector: '#confirm-no',
          messageSlotSelector: '#modal-body',
          showConfirmCallback: null
        })

        tc.confirm().then(response => {
          if (response) {
            document.querySelector('[data-testid="header"]').innerHTML = 'Custom Confirm Accepted'
          } else {
            document.querySelector('[data-testid="header"]').innerHTML = 'Custom Confirm Rejected'
          }
        })
      `)


      await expect(dialog).toBeVisible()
      await expect(dialog).toContainText(defaultContent)

      await dialog.locator('#description').click()

      await expect(dialog).toBeHidden()
      await expect(dialog).toContainText(defaultContent)
      await expect(header).toContainText('Custom Confirm Accepted')
    })

    test ('with content', async ({ page }) => {
      await page.goto('/confirms/custom')

      const header = page.getByTestId('header')
      const dialog = page.getByTestId('confirm')
      const defaultContent = await dialog.textContent() || ''

      page.evaluate(`
        const tc = new TurboConfirm({
          dialogSelector: '#custom-confirm',
          acceptSelector: '#confirm-yes',
          denySelector: '#confirm-no'
        })

        const contentMap = {
          '#modal-body': \`
            <h2 id="custom-title">Are You Absolutely Sure?</h2>
            <p id="custom-message">This can't be undone.</p>
          \`
        }

        tc.confirmWithContent(contentMap).then(response => {
          if (response) {
            document.querySelector('[data-testid="header"]').innerHTML = 'Custom Confirm With Content'
          } else {
            document.querySelector('[data-testid="header"]').innerHTML = 'Custom Reject With Content'
          }
        })
      `)

      await expect(dialog).toBeVisible()
      await expect(dialog.locator('#custom-title')).toContainText('Are You Absolutely Sure?')
      await expect(dialog.locator('#custom-message')).toContainText("This can't be undone.")

      await dialog.getByText("Yes, I'm Sure").click()

      await expect(dialog).toBeHidden()
      await expect(dialog).toContainText(defaultContent)
      await expect(header).toContainText('Custom Confirm With Content')
    })
  })
})
