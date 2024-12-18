const { Animal: AnimalModel, Animal } = require('../models/Animal');
const { Analysis: AnalysisModel } = require('../models/Analysis');

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
      res.statusText = error.message;
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  getAll: async (req, res) => {
    try {
      const userId = req.headers.userId;

      const allRegisteredCowByUserId = await AnimalModel.find({
        user_id: userId,
      });

      const allRegisteredAnimals = await Promise.all(
        allRegisteredCowByUserId.map(async (animal) => {
          const analysisHistoric = await AnalysisModel.find({
            animal_id: animal._id,
          });
          const lastAnalysis = analysisHistoric.reduce(
            (mostRecent, current) => {
              return new Date(mostRecent.created_at) >
                new Date(current.created_at)
                ? mostRecent
                : current;
            },
            analysisHistoric[0],
          );

          return {
            animal,
            lastAnalysis,
          };
        }),
      );

      res.status(200).json(allRegisteredAnimals);
    } catch (error) {
      console.log(error);
      res.statusText = error.message;
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  get: async (req, res) => {
    try {
      const id = req.params.id;
      const userId = req.headers.userId;

      const animal = await AnimalModel.findOne({
        _id: id,
        user_id: userId,
      });

      if (!animal) {
        return res.status(404).json({ message: 'Animal not found' });
      }

      const analysisHistoric = await AnalysisModel.find({
        animal_id: animal._id,
      });

      res.status(200).json({ animal, analysisHistoric });
    } catch (error) {
      console.log(error.message);
      res.statusText = error.message;
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = animalController;
