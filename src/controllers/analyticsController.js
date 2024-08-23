const { Animal: AnimalModel } = require('../models/Animal');
const { Analysis: AnalysisModel } = require('../models/Analysis');

const analyticsController = {
  getAnalytics: async (req, res) => {
    try {
      let positiveCases = 0,
        negativeCases = 0;
      const userId = req.headers.userId;

      const allRegisteredAnimals = await AnimalModel.find({ user_id: userId });

      for (let i = 0; i < allRegisteredAnimals.length; i++) {
        const getCowAnalysis = await AnalysisModel.find({
          animal_id: allRegisteredAnimals[i]['_id'],
        });
        positiveCases =
          getCowAnalysis.filter((data) => data.result === 'positivo').length +
          positiveCases;
        negativeCases =
          getCowAnalysis.filter((data) => data.result === 'negativo').length +
          negativeCases;
      }

      const currentPositiveCasesPercentage =
        (positiveCases / allRegisteredAnimals.length) * 100;

      res.status(200).json({
        registered_animals: allRegisteredAnimals.length,
        current_positive_cases_percentage: Math.round(
          currentPositiveCasesPercentage,
        ),
        current_positive_cases: positiveCases,
        current_negative_cases: negativeCases,
      });
    } catch (error) {
      console.log(error.message);
      res.statusMessage = error.message;
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  getAnalyticsGraphics: async (req, res) => {
    try {
      const { most_recent_date, earliest_date } = req.body;
      const initialDate = new Date(earliest_date);
      const endDate = new Date(most_recent_date);
      const userId = req.headers.userId;

      const allRegisteredAnimalsByUser = await AnimalModel.find({ user_id: userId });
      const animalIdsByUser = allRegisteredAnimalsByUser.map(animal => animal._id);
      const allAnalysisRegisteredByPeriod = await AnalysisModel.find({animal_id: animalIdsByUser, created_at: {$gte: initialDate, $lte: endDate}});

      const filterPositiveCases = allAnalysisRegisteredByPeriod.filter((data) => data.result === 'positivo');
      const filterNegativeCases = allAnalysisRegisteredByPeriod.filter((data) => data.result === 'negativo');

      res.status(200).json({
        graphics: {
          positive: filterPositiveCases,
          negative: filterNegativeCases,
        }
      })
    } catch (error) { 
      res.status(500);
      res.statusMessage = error.message;
    }
  }
};

module.exports = analyticsController;
