import { test, expect } from '@playwright/test'

test('title screen has both mode buttons', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('こどもモード')).toBeVisible()
  await expect(page.getByText('おやごさんモード')).toBeVisible()
})
