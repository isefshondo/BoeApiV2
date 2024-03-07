const router = require('express').Router()

const userRouter = require('./user')

// TODO: Create a route for every Controller file
router.use('/', userRouter)

module.exports = router
