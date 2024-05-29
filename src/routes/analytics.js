const router = require('express').Router()
const {tokenValidated} = require('../auth');

const analyticsController = require('../controllers/analyticsController');

router.get('', tokenValidated, analyticsController.getAnalytics);

module.exports = router;