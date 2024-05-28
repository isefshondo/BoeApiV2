const { Analysis: AnalysisModel } = require("../models/Analysis");

const analysisController = {
    create: async(req, res) => {
        try {
            
            const analysis = {
                id: req.body.id,
                animal_id: req.body.animal_id,
                user_token: req.body.user_token,
                analysis_img: req.body.analysis_img,
                analysis_date: req.body.analysis_date,
                disease_class: req.body.disease_class,
                accuracy: req.body.accuracy,
            }

            const response = await AnalysisModel.create(analysis)

            res.status(201).json({ response, msg: "Success!!! Animal created!!!"})
        } catch(error) {
            console.loge(error)
        }
    },
    getAll: async(req, res) => {
        try {
            const analysis = await AnalysisModel.find()

            res.json(animals)
        } catch(error) {
            console.log(error)
        }
    },
    get: async(req, res) => {
        try {
            const id = req.params.id
            const analysis = await AnalysisModel.findById(id)

            res.json(analysis)
        } catch(error){
            console.log(error)
        }
    }
}

module.exports = analysisController