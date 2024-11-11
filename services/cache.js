const mongoose = require('mongoose')
const redis = require('redis')
const util = require('util')

const redisUrl = 'redis://127.0.0.1:6379'
const client = redis.createClient(redisUrl)
client.get = util.promisify(client.get)

const exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.exec = async function () { // must use function keyword
  // console.log(this.getQuery()) // this -> current query thats being executed
  // console.log(this.mongooseCollection.name)

  const key = JSON.stringify(Object.assign({}, this.getQuery(), { collection: this.mongooseCollection.name }))
  console.log(key)

  //See we have a value for key
  const cacheValue = await client.get(key)

  // Yes -> return the value
  if (cacheValue) {
    const doc = JSON.parse(cacheValue)
    return Array.isArray(doc) ? doc.map(doc => new this.model(doc)) : new this.model(doc)
  }
  await client.set(key, JSON.stringify(result))
  return result
}