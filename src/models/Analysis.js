const mongoose = require('mongoose')

const { Schema } = mongoose

const analysisSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
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
        default: Date.now
    },
    disease_class: {
        type: String,
    },
    accuracy: {
        type: Number,
    },
    result: {
        type: String,
    },
})

const Analysis = mongoose.model('Analysis', analysisSchema)

module.exports = {
    Analysis,
    analysisSchema,
}