const router = require('express').Router();
const { tokenValidated } = require('../auth');

const farmController = require('../controllers/farmController');

router.post('/register', tokenValidated, farmController.create);
router.get('/employees', tokenValidated, farmController.getAllEmployees);
router.get('/all-animals', tokenValidated, farmController.getAllAnimalsFarm);
router.get(
  '/farm-detailed-statistics',
  tokenValidated,
  farmController.getFarmDetailedStatistics,
);

module.exports = router;
