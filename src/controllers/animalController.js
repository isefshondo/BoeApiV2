const { Animal: AnimalModel, Animal } = require('../models/Animal');
const { Analysis: AnalysisModel, Analysis } = require('../models/Analysis');

const animalController = {
  create: async (req, res) => {
    try {
      const userId = req.headers.userId;
      const { numberIdentification, name, image } = req.body;
      const animal = {
        user_id: userId,
        number_identification: numberIdentification,
        name,
        image,
      };

      const isAnimalAlreadyRegistered = await AnimalModel.findOne({
        number_identification: numberIdentification,
      });

      if (isAnimalAlreadyRegistered) {
        return res.status(400).json({
          message: "This animal's number identification is already registered",
        });
      }

      const newAnimal = new Animal(animal);
      await newAnimal.save();
      res.status(201).json({
        message: 'Cow created successfully',
        cowId: newAnimal['_id'],
        cowNumberIdentification: newAnimal['number_identification'],
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  getAll: async (req, res) => {
    try {
      let allRegisteredCows = [];
      const userId = req.headers.userId;

      const allRegisteredCowByUserId = await AnimalModel.find({
        user_id: userId,
      });

      for (let i = 0; i < allRegisteredCowByUserId.length; i++) {
        const analysisHistoric = await AnalysisModel.find({
          animal_id: allRegisteredCowByUserId[i]._id,
        });
        const lastAnalysis = analysisHistoric.reduce((mostRecent, current) => {
          return new Date(mostRecent.created_at) > new Date(current.created_at)
            ? mostRecent
            : current;
        }, analysisHistoric[0]);

        allRegisteredCows.push({
          animal: allRegisteredCowByUserId[i],
          lastAnalysis,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  get: async (req, res) => {
    try {
      const id = req.params.id;
      const user_token = req.header.user_token;

      const animal = await AnimalModel.findOne({
        id: id,
        userToken: user_token,
      });

      res.json(animal);
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = animalController;
