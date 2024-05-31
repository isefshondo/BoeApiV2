const router = require('express').Router();
const { tokenValidated } = require('../auth');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');

const analysisController = require('../controllers/analysisController');

const UPLOADS_DIR = path.join(__dirname, '../privates/uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.ensureDirSync(UPLOADS_DIR);
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const multerUpload = multer({ storage });

router.post(
  '',
  tokenValidated,
  multerUpload.single('analysis_img'),
  analysisController.create,
);

module.exports = router;
