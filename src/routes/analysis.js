const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const analysisController = require("../controllers/analysisController");

// Configuração do Multer para armazenar arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Diretório onde os arquivos serão armazenados
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);  // Nome do arquivo
    }
});
const upload = multer({ storage: storage });

router.post('/', upload.single('analysis_img'), analysisController.create);

module.exports = router;
