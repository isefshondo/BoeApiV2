const router = require('express').Router()

const userRouter = require('./user')
router.use('/user', userRouter)

const animalRouter = require('./animal')
router.use('/animal', animalRouter)

module.exports = router
