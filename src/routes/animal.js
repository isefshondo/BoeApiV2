const router = require("express").Router()

const animalController = require("../controllers/animalController");

router
    .route("/animal")
    .post((req, res) => animalController.create(res, req))

router.route("/animal").get((req, res) => animalController.getAll(req, res))

router
    .route("/animal/:id")
    .get((req, res) => animalController.get(req, res))

module.exports = router;