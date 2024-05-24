const router = require('express').Router()

const userRouter = require('./user')
router.use('/user', userRouter)

const cowRouter = require('./boe')
router.use('/cow', cowRouter)

module.exports = router
