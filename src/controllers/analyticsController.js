const {Animal: AnimalModel} = require('../models/Animal');
const {Analysis: AnalysisModel} = require('../models/Analysis');

const analyticsController = {
    getAnalytics: async (req, res) => {
        try {
            let positiveCases = 0, negativeCases = 0;
            const userId = req.headers.userId;

            const allRegisteredAnimals = await AnimalModel.find({user_id: userId});

            for (let i = 0; i < allRegisteredAnimals.length; i++) {
                const getCowAnalysis = await AnalysisModel.find({animal_id: allRegisteredAnimals[i]['_id']});
                positiveCases = getCowAnalysis.filter((data) => data.result === true).length + positiveCases;
                negativeCases = getCowAnalysis.filter((data) => data.result === false).length + negativeCases;
            }

            const currentPositiveCasesPercentage = (positiveCases / allRegisteredAnimals) * 100;

            res.status(200).json({
                registered_animals: allRegisteredAnimals.length,
                current_positive_cases_percentage: currentPositiveCasesPercentage,
                current_positive_cases: positiveCases,
                current_negative_cases: negativeCases,
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({message: "Internal server error"})
        }
    },
};

module.exports = analyticsController;