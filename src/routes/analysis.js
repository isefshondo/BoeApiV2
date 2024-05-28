const router = require("express").Router()

const analysisController = require("../controllers/analysisController");

router
    .route("/analysis")
    .post((req, res) => analysisController.create(res, req))

router.route("/analysis").get((req, res) => analysisController.getAll(req, res))

router
    .route("/analysis/:id")
    .get((req, res) => analysisController.get(req, res))

module.exports = router;