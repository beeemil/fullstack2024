const { test, expect, beforeEach, describe } = require('@playwright/test')
const { afterEach } = require('node:test')
const { loginWith, addBlogWith, createAccount, createBlogByPost } = require('./testHelper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3001/api/testing/reset')
    await createAccount(request, 'Matti Luukkainen', 'mluukkai','salainen')
    await createAccount(request, 'Eemil', 'beemil','sekret')
    await page.goto('http://localhost:5173')

    
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('Blogs')
    await expect(locator).toBeVisible()
    const loginLocator = page.getByText('Log in to application')
    await expect(loginLocator).toBeVisible()
  })
  describe('login', () => {
    test('login is successful with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai','salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })
    test('login is not successful with incorrect credentials', async ({ page }) => {
        await loginWith(page, 'mluukkai','sekret') 
        await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai','salainen')
      await page.waitForTimeout(500)
    })
    afterEach(async ({ page }) => {
      await page.getByRole('button', { name: 'logout' }).click()
    })
    test('a new blog can be created', async ({ page }) => {
      await addBlogWith(page, 'TestBlog','Test Tester', 'testingisimportant.com')
      await expect(page.getByText('TestBlog Test Tester')).toBeVisible()
    })
    describe('When a blog exists', () => {
      beforeEach(async ({ page }) => {
        await addBlogWith(page, 'TestBlog','Test Tester', 'testingisimportant.com')
      })
      test('A blog can be liked', async ({ page }) => {
        await page.getByRole('button', {name: 'show'}).click()
        await page.getByRole('button', {name: 'like'}).click()
        await expect(page.getByText('likes: 1')).toBeVisible()
      })
      test('A blog can be removed', async ({ page }) => {
        await page.getByRole('button', {name: 'show'}).click()
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', {name: 'Remove'}).click()
        await page.waitForTimeout(500)
        await expect(page.getByText('TestBlog Test Tester')).toBeHidden()
      })
      test('Remove button is not visible for user who did not add the blog', async ({ page }) => {
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'beemil', 'sekret')
        await page.getByRole('button', {name: 'show'}).click()
        await expect(page.getByRole('button', {name:'Remove'})).toBeHidden()
      })
    })
    describe('When multiple blogs exist', () => {
      beforeEach(async ({ page, request }) => {
        const token = `Bearer ${JSON.parse(await page.evaluate(() => {
          return window.localStorage.getItem('loggedBlogAppUser')
        })).token}`
        await createBlogByPost(request, 'test1', 'tester1','url1.com', 1, token)
        await createBlogByPost(request, 'test2', 'tester2','url2.com', 2, token)
        await createBlogByPost(request, 'test3', 'tester3','url3.com', 3, token)
        await page.waitForTimeout(1000)
        await page.reload()
        await page.getByText('test3').waitFor()
      })
      test('Blogs are in correct order based on number of likes', async ({ page }) => {

        const blogs = await page.locator('.blog-title').allTextContents()
        expect(blogs).toEqual(['test3 ','test2 ','test1 '])
      })
    })
  })
})