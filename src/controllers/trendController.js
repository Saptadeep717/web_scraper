const { getTrendsWithIP } = require('../services/trendService');

exports.fetchTrends = async (req, res) => {
  try {
    const [ipAddress, trends,fetchedDate] = await getTrendsWithIP();
    res.render('index', { trends, ipAddress, fetchedDate,error: null });
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.render('index', { trends: null, ipAddress: null,fetchedDate, error: error.message });
  }
};

exports.showHome = (req, res) => {
  res.render('index', { trends: null, ipAddress: null,fetchedDate:null, error: null });
};