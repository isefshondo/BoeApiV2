const { Analysis: AnalysisModel } = require("../models/Analysis");

const analysisController = {
    create: async (req, res) => {
        try {
            const { id, animal_id, created_at } = req.body;
            const image = req.file ? req.file.filename : null;

            if (!image) {
                return res.status(400).json({ msg: "Image is required." });
            }

            // Enviar a imagem para a API da IA
            const formData = new FormData();
            formData.append('image', req.file.buffer, req.file.originalname);

            const iaResponse = await axios.post('URL_DA_API_DA_IA', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Supondo que a resposta da IA contenha "disease_class" e "accuracy"
            const { disease_class, accuracy } = iaResponse.data;

            const analysis = {
                id,
                animal_id,
                created_at,
                disease_class,
                accuracy,
                image,
            };

            const newAnalysis = new AnalysisModel(analysis);
            await newAnalysis.save();

            res.status(201).json({ analysis: newAnalysis, msg: "Success!!! Analysis created!!!" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server error." });
        }
    },    
    getAll: async (req, res) => {
        try {
            const analysis = await AnalysisModel.find()

            res.json(analysis)
        } catch (error) {
            console.log(error)
        }
    },
    get: async (req, res) => {
        try {
            const id = req.params.id
            const analysis = await AnalysisModel.findById(id)

            res.json(analysis)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = analysisController