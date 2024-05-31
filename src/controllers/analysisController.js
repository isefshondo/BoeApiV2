const { Analysis: AnalysisModel } = require('../models/Analysis');
const path = require('path');
const fs = require('fs-extra');

const analysisController = {
  create: async (req, res) => {
    console.log({ file: req.file, body: req.body });
    const UPLOADS_DIR = path.join(__dirname, '../privates/uploads');
    const targetDir = path.join(UPLOADS_DIR, req.file.filename);

    try {
      await fs.ensureDir(UPLOADS_DIR);

      const { animal_id } = req.body;
      const analysis_img = req.file;

      console.log('Animal ID:', animal_id);
      console.log('Image received:', analysis_img);

      if (!analysis_img) {
        return res.status(400).json({ message: 'Image is required.' });
      }

      // Send image to AI API
      const formData = new FormData();
      formData.append('image', req.file.buffer, req.file.originalname);

      //   const aiResponse = await fetch('http://:5000', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //     body: formData,
      //   });

      //   const { accuracy, predicted_class, result } = await aiResponse.json();

      //   const analysis = {
      //     animal_id,
      //     created_at: new Date(),
      //     disease_class: predicted_class,
      //     accuracy,
      //     analysis_img: req.file.buffer,
      //     result: !result,
      //     treatment_status: 'Sem tratamento',
      //   };

      //   const newAnalysis = new AnalysisModel(analysis);
      //   await newAnalysis.save();

      //   res
      //     .status(201)
      //     .json({ newAnalysis, message: 'Analysis done successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  },
};

module.exports = analysisController;
