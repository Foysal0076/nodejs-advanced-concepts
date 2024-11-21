
const Page = require('./helpers/page')

let page

beforeEach(async () => {
  page = await Page.build()
  await page.goto('http://localhost:3000')
})

afterEach(async () => {
  await page.close()
})

test('Header Logo has the correct text', async () => {
  const text = await page.getContentOf('a.brand-logo', el => el.innerHTML)
  expect(text).toEqual('Blogster')
})

test('clicking login starts OAuth flow', async () => {
  await page.waitFor('.right a')
  await page.click('.right a')
  const url = await page.url()
  expect(url).toMatch(/accounts\.google\.com/)
})

test('when signed in show the logout button', async () => {
  // const user = '673026b41fa044502bfa280c'
  await page.login()

  const logoutButtonText = await page.getContentOf('a[href="/auth/logout"]', el => el.innerHTML)
  expect(logoutButtonText).toEqual('Logout')
})