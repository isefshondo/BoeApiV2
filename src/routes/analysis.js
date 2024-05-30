const router = require('express').Router();

const analysisController = require('../controllers/analysisController');

const analysisRoutes = [
  { method: 'post', path: '', controller: analysisController.create },
];

analysisRoutes.forEach((route) => {
  router[route.method](route.path, route.controller);
});

module.exports = router;
