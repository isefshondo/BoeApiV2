const { Animal: AnimalModel } = require("../models/Animal");

const animalController = {
    create: async(req, res) => {
        try {
            
            const animal = {
                id: req.body.id,
                name: req.body.name,
                image: req.body.image,
                disease_name: req.body.disease_name,
                infection_level: req.body.infection_level,
            }

            const response = await AnimalModel.create(animal)

            res.status(201).json({ response, msg: "Success!!! Animal created!!!"})
        } catch(error) {
            console.loge(error)
        }
    },
    getAll: async(req, res) => {
        try {
            const animals = await AnimalModel.find()

            res.json(animals)
        } catch(error) {
            console.log(error)
        }
    },
    get: async(req, res) => {
        try {
            const id = req.params.id
            const animal = await AnimalModel.findById(id)

            res.json(animal)
        } catch(error){
            console.log(error)
        }
    }
}

module.exports = animalController