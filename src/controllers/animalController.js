const { Animal: AnimalModel, Animal } = require("../models/Animal");

const animalController = {
    create: async(req, res) => {
        try {
            const userId = req.headers.userId;
            const {numberIdentification, name, image} = req.body;
            const animal = {
                user_id: userId,
                number_identification: numberIdentification,
                name,
                image,
            };

            const isAnimalAlreadyRegistered = await AnimalModel.findOne({number_identification: numberIdentification});

            if (isAnimalAlreadyRegistered) {
                return res.status(400).json({message: "This animal's number identification is already registered"});
            }

            const newAnimal = new Animal(animal);
            await newAnimal.save();
            res.status(201).json({message: "Cow created successfully", cowId: newAnimal['_id'], cowNumberIdentification: newAnimal['number_identification']});
        } catch(error) {
            console.log(error.message)
            res.status(500).json({message: "Internal server error"});
        }
    },
    getAll: async(req, res) => {
        try {
            let treatmentStatus, diseaseChancePercentage, disease;
            const userId = req.headers.userId;
            
            const allRegisteredCows = await AnimalModel.find({user_id: userId});

            for (let i = 0; i < allRegisteredCows.length; i++) {
                
            }

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