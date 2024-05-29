const { Analysis: AnalysisModel } = require("../models/Analysis");
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

const analysisController = {
    create: async (req, res) => {
        try {
            const { id, animal_id, created_at } = req.body;
            const image = req.file ? req.file.filename : null;

            if (!image) {
                return res.status(400).json({ msg: "Image is required." });
            }

            // Criar o FormData corretamente no Node.js
            const formData = new FormData();
            formData.append('analysis_img', fs.createReadStream(path.join(__dirname, '..', 'uploads', req.file.filename)));

            // Resposta para indicar que a imagem foi recebida (para debug)
            // res.status(200).json({ message: "chegou a imagem" });

            // Exemplo de como enviar para uma API de IA (descomentar e ajustar a URL da API)
            // const iaResponse = await axios.post('URL_DA_API_DA_IA', formData, {
            //     headers: formData.getHeaders()
            // });

            // Supondo que a resposta da IA contenha "disease_class" e "accuracy"
            // const { disease_class, accuracy } = iaResponse.data;

            const analysis = {
                id,
                animal_id,
                created_at,
                analysis_img: image,
            };

            const newAnalysis = new AnalysisModel(analysis);
            await newAnalysis.save();

            res.status(201).json({ analysis: newAnalysis, msg: "Success!!! Analysis created!!!" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server error." });
        }
    },
    // Outros métodos...
};

module.exports = analysisController;
