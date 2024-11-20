const puppeteer = require("puppeteer")

const sessionFactory = require('./factories/session-factory')
const userFactory = require('./factories/user-factory')
const Page = require('./helpers/page')

let browser, page

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  })
  page = await browser.newPage()
  await page.goto('http://localhost:3000')

})

afterEach(async () => {
  await browser.close()
})

test('Header Logo has the correct text', async () => {
  const text = await page.$eval('a.brand-logo', el => el.innerHTML)
  expect(text).toEqual('Blogster')
})

test('clicking login starts OAuth flow', async () => {
  await page.click('.right a')
  const url = await page.url()
  expect(url).toMatch(/accounts\.google\.com/)
})

test('when signed in show the logout button', async () => {
  // const user = '673026b41fa044502bfa280c'
  const user = await userFactory()
  const { session, sig } = sessionFactory(user)

  await page.setCookie({ name: 'session', value: session })
  await page.setCookie({ name: 'session.sig', value: sig })
  await page.goto('http://localhost:3000')
  await page.waitFor('a[href="/auth/logout"]')

  const logoutButtonText = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML)
  expect(logoutButtonText).toEqual('Logout')
})