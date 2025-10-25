const { test, expect, beforeEach, afterEach, describe } = require('@playwright/test')
const { before } = require('node:test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Tove Jansson',
        username: 'tofslan',
        password: 'heimuumit'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    
    await expect(page.locator('input').first()).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.locator('input').first().fill('tofslan')
      await page.locator('input[type="password"]').fill('heimuumit')
      await page.getByRole('button', { name: 'login' }).click()
			
			await page.waitForLoadState('networkidle')
      await expect(page.getByText('Tove Jansson logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.locator('input').first().fill('tove')
      await page.locator('input[type="password"]').fill('heimuumit')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Wrong username or password')).toBeVisible()
    })
    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'login' }).click()
        await page.locator('input').first().fill('tofslan')
        await page.locator('input[type="password"]').fill('heimuumit')
        await page.getByRole('button', { name: 'login' }).click()
        await expect(page.getByText('Tove Jansson logged in')).toBeVisible()
      })

			test('a new blog can be created', async ({ page }) => {
				await page.getByRole('button', { name: 'add new blog' }).click()
				await page.locator('input').first().fill('Taikatalvi')
				await page.locator('input').nth(1).fill('Tove Jansson')
				await page.locator('input').nth(2).fill('https://taikatalvi.blogspot.com')
				await page.getByRole('button', { name: 'create' }).click()
				await expect(page.getByText('Taikatalvi Tove Jansson')).toBeVisible()
			})

			test('users can like a blog', async ({ page }) => {
				await page.getByRole('button', { name: 'add new blog' }).click()
				await page.locator('input').first().fill('Taikatalvi')
				await page.locator('input').nth(1).fill('Tove Jansson')
				await page.locator('input').nth(2).fill('https://taikatalvi.blogspot.com')
				await page.getByRole('button', { name: 'create' }).click()

				await page.getByRole('button', { name: 'view' }).click()
				await expect(page.getByText('0 likes')).toBeVisible()
				await page.getByRole('button', { name: 'like' }).click()
				await expect(page.getByText('1 likes')).toBeVisible()
			})
			test('the user who created a blog can delete it', async ({ page }) => {
				await page.getByRole('button', { name: 'add new blog' }).click()
				await page.locator('input').first().fill('Taikatalvi')
				await page.locator('input').nth(1).fill('Tove Jansson')
				await page.locator('input').nth(2).fill('https://taikatalvi.blogspot.com')
				await page.getByRole('button', { name: 'create' }).click()

				await page.getByRole('button', { name: 'view' }).click()
				await page.getByTestId('remove-blog').waitFor()
				await expect(page.getByTestId('remove-blog')).toBeVisible()
				page.waitForEvent('dialog').then(d => d.accept())
				await page.getByRole('button', { name: 'remove' }).click()
				await page.waitForLoadState('networkidle')
				const blog = page.locator('.blog').filter({ hasText: 'Taikatalvi Tove Jansson' })
				await expect(blog).toHaveCount(0)
			})
		})
	})
	describe('When not logged in', () => {
		beforeEach(async ({ page }) => {
			await page.getByRole('button', { name: 'login' }).click()
			await page.locator('input').first().fill('tofslan')
			await page.locator('input[type="password"]').fill('heimuumit')
			await page.getByRole('button', { name: 'login' }).click()
			await page.waitForLoadState('networkidle')

			await page.getByRole('button', { name: 'add new blog' }).click()
			await page.locator('input').first().fill('Taikatalvi')
			await page.locator('input').nth(1).fill('Tove Jansson')
			await page.locator('input').nth(2).fill('https://taikatalvi.blogspot.com')
			await page.getByRole('button', { name: 'create' }).click()
			await page.getByRole('button', { name: 'logout' }).click()
		})
		test('visitors can like a blog', async ({ page }) => {
			await page.getByRole('button', { name: 'view' }).click()
			await expect(page.getByText('0 likes')).toBeVisible()
			await page.getByRole('button', { name: 'like' }).click()
			await expect(page.getByText('1 likes')).toBeVisible()
		})
		test('visitors cannot delete a blog', async ({ page }) => {
			await page.getByRole('button', { name: 'view' }).click()
			await expect(page.getByText('Taikatalvi Tove Jansson')).toBeVisible()
			await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
		})
	})
})
