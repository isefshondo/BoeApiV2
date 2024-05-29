const router = require("express").Router()
const upload = require("../middleware/upload")

const analysisController = require("../controllers/analysisController");

const analysisRoutes = [
    { method: 'post', path: '', controller: analysisController.create },
]

analysisRoutes.forEach((route) => {
    router[route.method](route.path, upload.single('analysis_img'), route.controller)
  })

module.exports = router;