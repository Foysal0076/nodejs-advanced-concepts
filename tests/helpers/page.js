const puppeteer = require('puppeteer')

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
        return customPage[property] || browser[property] || page[property]
      }
    })
  }

  constructor(page, browser) {
    this.page = page
    this.browser = browser
  }

}

module.exports = CustomPage