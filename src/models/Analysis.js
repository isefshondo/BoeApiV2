const mongoose = require('mongoose');

const { Schema } = mongoose;

const analysisSchema = new Schema({
  animal_id: {
    type: String,
    required: true,
  },
  analysis_img: {
    type: Buffer,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  disease_class: {
    type: String,
    required: true,
  },
  accuracy: {
    type: Number,
    required: true,
  },
  treatment_status: {
    type: String,
    required: true,
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Analysis = mongoose.model('Analysis', analysisSchema);

module.exports = {
  Analysis,
  analysisSchema,
};
