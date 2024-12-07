const { Farm: FarmModel, Farm } = require('../models/Farm');

const farmController = {
  create: async (req, res) => {
    try {
      const userId = req.headers.userId;
      const { name, phone, tax_id, zip_code, state, city, address, employees } =
        req.body;
      const farm = {
        owner_id: userId,
        name,
        phone,
        tax_id,
        zip_code,
        state,
        city,
        address,
        employees,
      };

      const isFarmAlreadyRegistered = await FarmModel.findOne({
        tax_id: tax_id,
      });

      if (isFarmAlreadyRegistered) {
        return res.status(400).json({
          message: "This farm's tax id is already registered",
        });
      }

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
};
