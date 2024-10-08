const { Animal: AnimalModel } = require('../models/Animal');
const { Analysis: AnalysisModel } = require('../models/Analysis');

const analyticsController = {
  getAnalytics: async (req, res) => {
    try {
      const userId = req.headers.userId;

      const allRegisteredAnimals = await AnimalModel.find({ user_id: userId });

      const positiveCases = await AnalysisModel.countDocuments({
        animal_id: { $in: allRegisteredAnimals.map((animal) => animal._id) },
        result: 'positivo',
      });

      const negativeCases = await AnalysisModel.countDocuments({
        animal_id: { $in: allRegisteredAnimals.map((animal) => animal._id) },
        result: 'negativo',
      });

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
      const userId = req.headers.userId;
      const { earliest_date, most_recent_date } = req.body;
      const allRegisteredAnimals = await AnimalModel.find({ user_id: userId });
      const allRegisteredAnimalsIds = allRegisteredAnimals.map(
        (animal) => animal._id,
      );
      const allAnalysis = await AnalysisModel.find({
        animal_id: { $in: allRegisteredAnimalsIds },
      });
      const filterAnalysisByPeriod = allAnalysis.filter(
        (analysis) =>
          analysis.date >= earliest_date && analysis.date <= most_recent_date,
      );
      const groupAnalysisByDate = filterAnalysisByPeriod.reduce(
        (acc, analysis) => {
          const formatDateToISO = analysis.created_at
            .toISOString()
            .split('T')[0];
          if (!acc[formatDateToISO]) {
            acc[formatDateToISO] = { positive: 0, negative: 0 };
          }
          if (analysis.result === 'positivo') {
            acc[formatDateToISO].positive += 1;
          } else if (analysis.result === 'negativo') {
            acc[formatDateToISO].negative += 1;
          }
          return acc;
        },
        {},
      );
      return Object.entries(groupAnalysisByDate).map(([date, analysis]) => ({
        date,
        ...analysis,
      }));
    } catch (error) {
      res.status(500);
      res.statusMessage = error.message;
    }
  },
};

module.exports = analyticsController;
