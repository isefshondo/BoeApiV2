const router = require('express').Router();

const userRouter = require('./user');
router.use('/user', userRouter);

const animalRouter = require('./animal');
router.use('/animal', animalRouter);

const analysisRouter = require('./analysis');
router.use('/analysis', analysisRouter);

const analyticsRouter = require('./analytics');
router.use('/analytics', analyticsRouter);

module.exports = router;
