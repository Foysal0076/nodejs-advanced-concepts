const mongoose = require('mongoose')
const requireLogin = require('../middlewares/requireLogin')
const { clearHash } = require('../services/cache')
const cleanCache = require('../middlewares/clean-cache')

const Blog = mongoose.model('Blog')

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    })

    res.send(blog)
  })

  // app.get('/api/blogs', requireLogin, async (req, res) => {
  //   const redis = require('redis')
  //   const redisUrl = 'redis://127.0.0.1:6379'
  //   const client = redis.createClient(redisUrl)
  //   const util = require('util')
  //   client.get = util.promisify(client.get)

  //   // Do we have any cached data in redis related to this query
  //   const cachedBlogs = await client.get(`blogs_${req.user.id}`)

  //   // if yes, then respond to the request right way and return
  //   if (cachedBlogs) {
  //     console.log('SERVING FROM CACHE')
  //     return res.send(JSON.parse(cachedBlogs))
  //   }

  //   // if no, we need to respond to request
  //   // and update our cache to store the data
  //   const blogs = await Blog.find({ _user: req.user.id })
  //   console.log('SERVING FROM MONGODB')
  //   await client.set(`blogs_${req.user.id}`, JSON.stringify(blogs))
  //   res.send(blogs)
  // })

  //* Optimized and reusable
  app.get('/api/blogs', requireLogin, async (req, res) => {
    const blogs = await Blog.find({ _user: req.user.id }).cache({ key: req.user.id })
    res.send(blogs)
  })

  app.post('/api/blogs', requireLogin, cleanCache, async (req, res) => {
    const { title, content, imageUrl } = req.body

    const blog = new Blog({
      title,
      content,
      imageUrl,
      _user: req.user.id
    })

    try {
      await blog.save()
      res.send(blog)
    } catch (err) {
      res.send(400, err)
    }
  })
}
