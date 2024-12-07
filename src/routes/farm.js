const router = require('express').Router();
const { tokenValidated } = require('../auth');

const farmController = require('../controllers/farmController');

router.post('/register', tokenValidated, farmController.create);

module.exports = router;
