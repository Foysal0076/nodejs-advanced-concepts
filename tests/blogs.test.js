const Page = require('./helpers/page')

let page

beforeEach(async () => {
  page = await Page.build()
  await page.goto('http://localhost:3000')
})

afterEach(async () => {
  await page.close()
})

describe('When logged in', async () => {
  beforeEach(async () => {
    await page.login()
    await page.click('a.btn-floating')
  })

  test('can see blog create form', async () => {
    const label = await page.getContentOf('form label')
    expect(label).toEqual('Blog Title')
  })

  describe('and using invalid inputs', async () => {
    beforeEach(async () => {
      await page.type('.title input', 'title')
      await page.type('.content input', 'content')
      await page.click('form button')
    })

    test('submitting takes user to review content screen', async () => {
      const text = await page.getContentOf('h5')
      expect(text).toEqual('Please confirm your entries')
    })
    test('Submitting then saving adds the blog to blog page ', async () => {
      await page.click('button.green')
      await page.waitFor('.card')
      const blogTitle = await page.getContentOf('.card-content .card-title')
      expect(blogTitle).toEqual('title')
      const cardContent = await page.getContentOf('.card-content p')
      expect(cardContent).toEqual('content')
    })
  })

  describe('and using invalid inputs', async () => {
    beforeEach(async () => {
      await page.click('form button')
    })
    test('the form shows an error message', async () => {
      const titleError = await page.getContentOf('.title .red-text')
      const contentError = await page.getContentOf('.content .red-text')

      expect(titleError).toEqual('You must provide a value')
      expect(contentError).toEqual('You must provide a value')
    })
  })
})

// describe('when not logged in', async () => {

//   test('user cannot create blog posts', async () => {
//     const result = await page.post('/api/blogs', { title: 'TITLE', content: "CONTENT" })
//     expect(result).toEqual({ error: 'You must log in!' })
//   })

//   test('user cannot get list of blog posts', async () => {
//     const result = await page.get('/api/blogs')
//     expect(result).toEqual({ error: 'You must log in!' })
//   })
// })

describe('If user is not logged in', async () => {

  const actions = [
    {
      method: 'get',
      path: '/api/blogs',
    },
    {
      method: 'post',
      path: '/api/blogs',
      data: { title: 'TITLE', content: "CONTENT" }
    },
  ]

  test('Blog related actions are prohibited', async () => {
    const results = await page.execRequests(actions)
    for (let result of results) {
      expect(result.value).toEqual({ error: 'You must log in!' })
    }
  })
})