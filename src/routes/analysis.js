const router = require('express').Router();
const fs = require('fs').promises;
const path = require('path');
const { tokenValidated } = require('../auth');
const upload = require('../middleware/uploadMiddleware');
const analysisController = require('../controllers/analysisController');

// router.use(async (req, res, next) => {
//   try {
//     const uploadDir = path.join(__dirname, '../privates/uploads');
//     await fs.mkdir(uploadDir, { recursive: true });
//     next();
//   } catch (error) {
//     console.log(error);
//     // next(error);
//   }
// });

router.post(
  '',
  tokenValidated,
  upload.single('analysis_img'),
  analysisController.create,
);

// router.use(async (req, res, next) => {
//   try {
//     const uploadDir = path.join(__dirname, '../privates/uploads');
//     await fs.rmdir(uploadDir, { recursive: true });
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;
