const router = require('express').Router()

const userController = require('../controllers/userController')

const userPublicRoutes = [
  { method: 'post', path: '/signup', controller: userController.signUp },
  { method: 'post', path: '/signin', controller: userController.signIn },
]

const userPrivateRoutes = [
  { method: 'put', path: '/update', controller: userController.update },
  { method: 'delete', path: '/delete', controller: userController.delete },
]

userPublicRoutes.forEach((route) => {
  router[route.method](route.path, route.controller)
})

module.exports = router
