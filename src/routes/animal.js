const router = require("express").Router()
const { tokenValidated } = require('../auth');

const animalController = require("../controllers/animalController");

const animalRoutes = [
    { method: 'post', path: '', controller: animalController.create },
    { method: 'get', path: '', controller: animalController.getAll },
    { method: 'get', path: '/:id', controller: animalController.get },
]

animalRoutes.forEach((route) => {
    router[route.method](route.path, tokenValidated, route.controller)
  })

module.exports = router;