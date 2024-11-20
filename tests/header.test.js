const puppeteer = require("puppeteer")

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

test.only('when signed in show the logout button', async () => {
  const user = '673026b41fa044502bfa280c'
  const Buffer = require('safe-buffer').Buffer
  const session = {
    passport: {
      user
    }
  }
  const sessionString = Buffer.from(JSON.stringify(session)).toString('base64')

  const Keygrip = require('keygrip')
  const keys = require('../config/keys')
  const keygrip = new Keygrip([keys.cookieKey])
  const sig = keygrip.sign(`session=${sessionString}`)
  console.log(sessionString, sig)
  await page.setCookie({ name: 'session', value: sessionString })
  await page.setCookie({ name: 'session.sig', value: sig })
  await page.goto('http://localhost:3000')
  await page.waitFor('a[href="/auth/logout"]')

  const logoutButtonText = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML)
  expect(logoutButtonText).toEqual('Logout')
})