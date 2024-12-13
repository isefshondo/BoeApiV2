const mongoose = require('mongoose');
const { Schema } = mongoose;

const farmSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  tax_id: {
    type: String,
    required: true,
  },
  zip_code: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  owner_id: {
    type: String,
    required: true,
  },
  employees: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const Farm = mongoose.model('Farm', farmSchema);

module.exports = {
  Farm,
  farmSchema,
};
