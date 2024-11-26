require('dotenv').config()

module.exports = {
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  mongoURI: process.env.MONGO_URI,
  cookieKey: process.env.COOKIE_KEY,
  redisUrl: process.env.REDIS_URL,
  s3AccessKey: process.env.S3_ACCESS_KEY,
  s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY
}
