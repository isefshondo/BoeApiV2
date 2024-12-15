const { Animal: AnimalModel } = require('../models/Animal');
const { Analysis: AnalysisModel } = require('../models/Analysis');
const { User: UserModel, User } = require('../models/User');
const { Farm: FarmModel } = require('../models/Farm');

const analyticsController = {
  getAnalytics: async (req, res) => {
    try {
      const diseaseLabels = ['Berne', 'Dermatite Nodular'];
      const userId = req.headers.userId;

      const allRegisteredAnimals = await AnimalModel.find({ user_id: userId });

      const positiveCases = await AnalysisModel.countDocuments({
        animal_id: { $in: allRegisteredAnimals.map((animal) => animal._id) },
        disease_class: { $in: diseaseLabels },
      });

      const negativeCases = await AnalysisModel.countDocuments({
        animal_id: { $in: allRegisteredAnimals.map((animal) => animal._id) },
        result: { $in: ['Saudável'] },
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
      const allRegisteredAnimals = await AnimalModel.find({ user_id: userId });
      const allRegisteredAnimalsIds = allRegisteredAnimals.map((animal) =>
        animal._id.toString(),
      );
      const allAnalysis = await AnalysisModel.find({
        animal_id: { $in: allRegisteredAnimalsIds },
      });
      const filterAnalysisByPeriod = allAnalysis.filter(
        (analysis) =>
          analysis.created_at >= new Date(earliest_date) &&
          analysis.created_at <= new Date(most_recent_date),
      );
      const groupAnalysisByDate = filterAnalysisByPeriod.reduce(
        (acc, analysis) => {
          const formatDateToISO = analysis.created_at
            .toISOString()
            .split('T')[0];
          if (!acc[formatDateToISO]) {
            acc[formatDateToISO] = { positive: 0, negative: 0 };
          }
          if (diseaseLabels.includes(analysis.disease_class)) {
            acc[formatDateToISO].positive += 1;
          } else if (analysis.disease_class === 'Saudável') {
            acc[formatDateToISO].negative += 1;
          }
          return acc;
        },
        {},
      );
      const labels = Object.keys(groupAnalysisByDate);
      const positiveData = labels.map(
        (date) => groupAnalysisByDate[date].positive,
      );
      const negativeData = labels.map(
        (date) => groupAnalysisByDate[date].negative,
      );
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
