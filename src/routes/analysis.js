const router = require('express').Router();
const fs = require('fs');
const { tokenValidated } = require('../auth');
const upload = require('../middleware/uploadMiddleware');

const analysisController = require('../controllers/analysisController');

router.use((req, res, next) => {
  const uploadDir = '../privates/uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  next();
});

router.post(
  '',
  tokenValidated,
  upload.single('analysis_img'),
  analysisController.create,
);

router.use((req, res, next) => {
  const uploadDir = '../privates/uploads';
  if (fs.existsSync(uploadDir)) {
    fs.rmdirSync(uploadDir, { recursive: true });
  }
  next();
});

module.exports = router;
