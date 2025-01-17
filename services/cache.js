'use strict'
const mongoose = require('mongoose')
const redis = require('redis')
const util = require('util')
const keys = require('../config/keys')

const client = redis.createClient(keys.redisUrl)
client.hget = util.promisify(client.hget)

const exec = mongoose.Query.prototype.exec
mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true
  this.hashKey = JSON.stringify(options?.key || '')
  return this // this return statement makes the function call chainable. ex: .cache().limit().sort()
}

mongoose.Query.prototype.exec = async function () { // must use function keyword
  // console.log(this.getQuery()) // this -> current query thats being executed
  // console.log(this.mongooseCollection.name)

  if (!this.useCache) {
    return exec.apply(this, arguments)
  }

  const key = JSON.stringify(Object.assign({}, this.getQuery(), { collection: this.mongooseCollection.name }))

  //See we have a value for key
  const cacheValue = await client.hget(this.hashKey, key)

  // Yes -> return the value
  if (cacheValue) {
    const doc = JSON.parse(cacheValue)
    console.log('from cached value')
    return Array.isArray(doc) ? doc.map(doc => new this.model(doc)) : new this.model(doc)
  }

  const result = await exec.apply(this, arguments)
  await client.hset(this.hashKey, key, JSON.stringify(result))
  return result
}

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey))
  }
}