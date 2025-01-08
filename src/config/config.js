require('dotenv').config();

module.exports = {
  MONGODB_URI:process.env.MONGODB_URI || "mongodb://localhost:27017/web_scraper",
  PROXY_USERNAME: process.env.PROXY_USERNAME,
  PROXY_URL:process.env.PROXY_URL,
  PROXY_PASSWORD: process.env.PROXY_PASSWORD,
  PROXY_HOST: process.env.PROXY_HOST,
  PROXY_PORT: process.env.PROXY_PORT,
  TWITTER_USERNAME: process.env.TWITTER_USERNAME,
  TWITTER_PASSWORD: process.env.TWITTER_PASSWORD,
  TWITTER_EMAIL: process.env.TWITTER_EMAIL,
};