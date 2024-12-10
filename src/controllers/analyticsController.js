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
      const diseaseLabels = ['Berne', 'Dermatite Nodular'];
      const userId = req.headers.userId;
      const { earliest_date, most_recent_date } = req.body;

      const allAnalysis = await AnalysisModel.aggregate([
        {
          $match: {
            user_id: userId,
            created_at: {
              $gte: new Date(earliest_date),
              $lte: new Date(most_recent_date),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$created_at' },
            },
            positive: {
              $sum: {
                $cond: [{ $in: ['$disease_class', diseaseLabels] }, 1, 0],
              },
            },
            negative: {
              $sum: {
                $cond: [{ $eq: ['$disease_class', 'Saudável'] }, 1, 0],
              },
            },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      const labels = allAnalysis.map((item) => item._id);
      const positiveData = allAnalysis.map((item) => item.positive);
      const negativeData = allAnalysis.map((item) => item.negative);

      const chartData = {
        labels,
        datasets: [
          {
            data: positiveData,
            color: 'rgba(75, 192, 192, .8)',
            labels: 'Positivos',
          },
          {
            data: negativeData,
            color: 'rgba(255, 99, 132, .8)',
            labels: 'Negativos',
          },
        ],
      };

      res.status(200).json(chartData);
    } catch (error) {
      res.status(500);
      res.statusMessage = error.message;
    }
  },
};

module.exports = analyticsController;
