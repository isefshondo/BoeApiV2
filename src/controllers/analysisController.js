const { Analysis: AnalysisModel } = require("../models/Analysis");

const analysisController = {
    create: async (req, res) => {
        try {

            const analysis = {
                id: req.body.id,
                animal_id: req.body.animal_id,
                created_at: req.body.created_at,
                disease_class: req.body.disease_class,
                accuracy: req.body.accuracy,
            }
            const image = req.file ? req.file.filename : null;

            // chamada pra IA
            // const {} =

            await AnalysisModel.updateOne({cowId: animal_id, image })

            res.status(201).json({ response, msg: "Success!!! Animal created!!!" })
        } catch (error) {
            console.loge(error)
        }
    },
    getAll: async (req, res) => {
        try {
            const analysis = await AnalysisModel.find()

            res.json(animals)
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