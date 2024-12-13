const mongoose = require('mongoose');
const { Farm: FarmModel, Farm } = require('../models/Farm');
const { User: UserModel, User } = require('../models/User');

const farmController = {
  create: async (req, res) => {
    try {
      const userId = req.headers.userId;
      const { name, phone, tax_id, zip_code, state, city, address } = req.body;
      const farm = {
        owner_id: userId,
        name,
        phone,
        tax_id,
        zip_code,
        state,
        city,
        address,
        employees: [],
      };

      const isFarmAlreadyRegistered = await FarmModel.findOne({
        tax_id: tax_id,
      });

      if (isFarmAlreadyRegistered) {
        return res.status(400).json({
          message: "This farm's tax id is already registered",
        });
      }

      console.log(req.body, "cheguei na rota de cadastro da fazenda");
      const newFarm = new Farm(farm);
      await newFarm.save();
      res.status(201).json({
        message: 'Farm created successfully',
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  getAllEmployees: async (req, res) => {
    try {
      const userId = req.headers.userId;
      const farm = await FarmModel.findOne({
        owner_id: mongoose.Types.ObjectId(userId),
      }).lean();
      const employees = await User.find({ farm_id: farm._id }).lean();
      const buildFarmEmployeesResDto = await Promise.all(
        employees.map(async (employee) => {
          const analysisCount = await Analysis.countDocuments({
            created_by: employee._id,
          });
          return {
            ...employee,
            analysisCount,
          };
        }),
      );
      res.status(200).json(buildFarmEmployeesResDto);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = farmController;
