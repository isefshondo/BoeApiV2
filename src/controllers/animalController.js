const { Animal: AnimalModel } = require("../models/Animal");

const animalController = {
    create: async(req, res) => {
        try {
            console.log('CHEGUEI AQUI');
            
            const animal = {
                id: req.body.id,
                user_token: req.body.user_token,
                name: req.body.name,
                image: req.body.image,
            }

            const doesAnimalAlreadyExist = await AnimalModel.findOne({
                id: animal.id,
            })
            
            if (doesAnimalAlreadyExist) {
                return res
                  .status(400)
                  .json({ message: 'This animal is already registered' })
            }

            const response = await AnimalModel.create(animal)

            res.status(201).json({ response, msg: "Success!!! Animal created!!!"})
        } catch(error) {
            console.log(error.message)
        }
    },
    getAll: async(req, res) => {
        try {
            const user_token = req.header.user_token
            const animals = await AnimalModel.find(user_token)

            res.json(animals)
        } catch(error) {
            console.log(error)
        }
    },
    get: async(req, res) => {
        try {
            const id = req.params.id
            const user_token = req.header.user_token

            const animal = await AnimalModel.findOne({ id: id, userToken: user_token });

            res.json(animal)
        } catch(error){
            console.log(error)
        }
    }
}

module.exports = animalController