// @ts-check
import { test, expect } from '@playwright/test'

let todos;

test.beforeAll(async ({ request }) => {
  const response = await request.post('/todos/setup')
  expect(response.ok()).toBeTruthy()
  todos = await response.json()

  expect(todos.length).toBe(3)
  todos.forEach(todo => {
    expect(Object.keys(todo)).toEqual(expect.arrayContaining(['id', 'title', 'body']))
  })
})

test.afterAll(async ({ request }) => {
  const respone = await request.delete('/todos/teardown')
  expect(respone.ok()).toBeTruthy()
})

test('Turbo Confirmation Integration', async ({ page }) => {
  await page.goto('/todos')

  const header = page.getByTestId('header')
  const dialog = page.getByTestId('confirm')
  const todoDialog = page.getByTestId('confirm-todo')
  const defaultContent = await dialog.textContent() || ''
  const todosCount = await page.locator('.todo-card').count()

  await expect(header).toContainText('Todos')

  await page.getByTestId(`todo_${todos[0]['id']}`).getByRole('button', {name: 'delete'}).click()

  await expect(dialog).toBeVisible()
  await expect(dialog).not.toContainText(defaultContent)

  await dialog.getByRole('button', {name: 'Cancel'}).click()

  await expect(dialog).toBeHidden()
  await expect(dialog).toContainText(defaultContent)
  await expect(header).toContainText('Confirm Rejected')

  await page.getByTestId(`todo_${todos[0]['id']}`).getByRole('button', {name: 'delete'}).click()

  await expect(dialog).toBeVisible()
  await expect(dialog).not.toContainText(defaultContent)
  await expect(dialog.locator('#confirm-title')).toContainText('Are you sure you want to delete this todo?')
  await expect(dialog.locator('#confirm-body')).toContainText(todos[0]['body'])

  // delete first todo
  await dialog.getByRole('button', {name: 'Delete ToDo'}).click()

  await expect(dialog).toBeHidden()
  await expect(dialog).toContainText(defaultContent)
  expect(await page.locator('.todo-card').count()).toBe(todosCount - 1)

  // navigate to first remaining todo's show page
  await page.getByRole('link', {name: todos[1]['title']}).click()

  await expect(header).toContainText('Todo Page')

  await expect(dialog).toBeHidden()
  await expect(todoDialog).toBeHidden()

  // interact with non-Turbo controlled confirm with alternate configuration
  await page.getByRole('button', {name: 'Not Done'}).click()

  await expect(todoDialog).toBeVisible()
  await expect(dialog).toBeHidden()

  // mark as done
  await todoDialog.getByRole('button', {name: 'Done', exact: true}).click()

  await expect(todoDialog).toBeHidden()
  await expect(dialog).toBeHidden()

  // interact with Turbo controlled confirm on the same page
  await page.getByRole('link', {name: 'Delete'}).click()

  await expect(todoDialog).toBeHidden()
  await expect(dialog).toBeVisible()

  await expect(dialog.locator('#confirm-title')).toContainText('You want to delete this ToDo?')
  await expect(dialog.locator('#confirm-body')).toContainText(todos[1]['body'])

  // delete second todo
  await dialog.getByRole('button', {name: 'Delete it!'}).click()

  // back on the index page
  await expect(header).toContainText('Todos')
  expect(await page.locator('.todo-card').count()).toBe(todosCount - 2)
});
