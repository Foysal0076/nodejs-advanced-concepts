const puppeteer = require('puppeteer')
const userFactory = require('../factories/user-factory')
const sessionFactory = require('../factories/session-factory')

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    })

    const page = await browser.newPage()
    const customPage = new CustomPage(page)

    return new Proxy(customPage, {
      get: function (target, property) {
        return target[property] || browser[property] || page[property]
      }
    })
  }

  constructor(page, browser) {
    this.page = page
    this.browser = browser
  }

  async login() {
    const user = await userFactory()
    const { session, sig } = sessionFactory(user)

    await this.page.setCookie({ name: 'session', value: session })
    await this.page.setCookie({ name: 'session.sig', value: sig })
    await this.page.goto('http://localhost:3000')
    await this.page.waitFor('a[href="/auth/logout"]')
  }

}

module.exports = CustomPage