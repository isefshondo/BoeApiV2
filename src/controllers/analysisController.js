const mongoose = require('mongoose');
const { Analysis: AnalysisModel } = require('../models/Analysis');
const path = require('path');
const fs = require('fs-extra');
const FormData = require('form-data');

const analysisController = {
  create: async (req, res) => {
    const UPLOADS_DIR = path.join(__dirname, '../privates/uploads');
    const targetDir = path.join(UPLOADS_DIR, req.file.filename);

    try {
      await fs.ensureDir(UPLOADS_DIR);

      const { animal_id } = req.body;
      const analysis_img = req.file;

      if (!analysis_img) {
        return res.status(400).json({ message: 'Image is required.' });
      }

      const formData = new FormData();
      formData.append(
        'file',
        fs.createReadStream(targetDir),
        analysis_img.originalname,
      );

      const fetch = (await import('node-fetch')).default;
      const aiResponse = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: formData.getHeaders(),
        body: formData,
      });

      const { confidence, predicted_class } = await aiResponse.json();
      const formattedConfidence = Number(confidence.replace('%', ''));

      const analysis = {
        animal_id,
        created_at: new Date(),
        disease_class: predicted_class,
        accuracy: formattedConfidence,
        analysis_img: fs.readFileSync(targetDir),
        treatment_status: 'Sem tratamento',
        created_by: mongoose.Types.ObjectId(req.headers.userId),
      };

      const newAnalysis = new AnalysisModel(analysis);
      await newAnalysis.save();

      await fs.remove(targetDir);

      res
        .status(201)
        .json({ newAnalysis, message: 'Analysis done successfully.' });
    } catch (error) {
      console.log(error.message);
      res.statusMessage = error.message;
      res.status(500).json({ error: 'Internal server error.' });
    }
  },
};

module.exports = analysisController;
