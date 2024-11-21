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

    await this.page.goto('http://localhost:3000/blogs')
    await this.page.waitFor('a[href="/auth/logout"]')
  }

  async getContentOf(selector) {
    return this.page.$eval(selector, el => el.innerHTML)
  }

  get(path) {
    return this.page.evaluate((_path) => {
      return fetch(_path, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
      }).then(res => res.json())
    }, path)
  }

  post(path, data) {
    return this.page.evaluate((_path, _data) => {
      return fetch(_path, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(_data)
      }).then(res => res.json())
    }, path, data)
  }
}

module.exports = CustomPage