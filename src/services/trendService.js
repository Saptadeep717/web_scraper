const TwitterScraper = require('../utils/twitterScraper');

exports.getTrendsWithIP = async () => {
  const scraper = new TwitterScraper();
  const options = {
    timeZone: "Asia/Kolkata",
    hour12: false, 
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  const date = new Date();
  const fetchedDate = date.toLocaleString("en-US", options);
  try {
    await scraper.login();
    const trends = await scraper.getTrendingTopics();
    const ipAddress = await scraper.getIpAddress();
    
    await scraper.saveTrendsToDB(trends, ipAddress);
    return [ipAddress, trends,fetchedDate];
  } finally {
    await scraper.close();
  }
};
