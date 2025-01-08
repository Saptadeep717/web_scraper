const express = require('express');
const { fetchTrends, showHome } = require('../controllers/trendController');

const router = express.Router();

router.get('/', showHome);
router.get('/api/v1/trends', fetchTrends);

module.exports = router;